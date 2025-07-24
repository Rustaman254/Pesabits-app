// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title DeFiLendingPool
 * @dev A lending pool contract similar to Aave that allows users to supply, borrow, withdraw, and repay assets
 */
contract DeFiLendingPool is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    // Struct to store reserve data
    struct ReserveData {
        uint256 totalSupply;           // Total amount supplied
        uint256 totalBorrow;           // Total amount borrowed
        uint256 liquidityRate;         // Current liquidity (supply) rate
        uint256 borrowRate;            // Current borrow rate
        uint256 liquidityIndex;        // Cumulative liquidity index
        uint256 borrowIndex;           // Cumulative borrow index
        uint256 lastUpdateTimestamp;   // Last time the rates were updated
        bool isActive;                 // Whether the reserve is active
        bool canSupply;                // Whether users can supply this asset
        bool canBorrow;                // Whether users can borrow this asset
        uint256 collateralFactor;      // Percentage of asset value that can be used as collateral (in basis points)
        uint256 liquidationThreshold; // Threshold for liquidation (in basis points)
    }

    // Struct to store user data for each reserve
    struct UserReserveData {
        uint256 principalSupply;       // User's principal supply amount
        uint256 principalBorrow;       // User's principal borrow amount
        uint256 lastSupplyIndex;       // Last liquidity index when user supplied
        uint256 lastBorrowIndex;       // Last borrow index when user borrowed
        bool useAsCollateral;          // Whether user wants to use this asset as collateral
    }

    // Events
    event Supply(address indexed user, address indexed asset, uint256 amount);
    event Withdraw(address indexed user, address indexed asset, uint256 amount);
    event Borrow(address indexed user, address indexed asset, uint256 amount);
    event Repay(address indexed user, address indexed asset, uint256 amount);
    event ReserveInitialized(address indexed asset);
    event CollateralToggled(address indexed user, address indexed asset, bool useAsCollateral);

    // Constants
    uint256 public constant RATE_PRECISION = 1e27;
    uint256 public constant PERCENTAGE_FACTOR = 10000; // 100.00%
    uint256 public constant SECONDS_PER_YEAR = 365 days;

    // State variables
    mapping(address => ReserveData) public reserves;
    mapping(address => mapping(address => UserReserveData)) public userReserves;
    address[] public reservesList;
    
    // Price oracle (simplified - in production use Chainlink or similar)
    mapping(address => uint256) public assetPrices; // Price in USD with 8 decimals

    modifier onlyActiveReserve(address asset) {
        require(reserves[asset].isActive, "Reserve is not active");
        _;
    }

    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @dev Initialize a new reserve
     * @param asset The address of the underlying asset
     * @param liquidityRate Initial liquidity rate
     * @param borrowRate Initial borrow rate
     * @param collateralFactor Collateral factor in basis points (e.g., 8000 = 80%)
     */
    function initializeReserve(
        address asset,
        uint256 liquidityRate,
        uint256 borrowRate,
        uint256 collateralFactor,
        uint256 liquidationThreshold
    ) external onlyOwner {
        require(!reserves[asset].isActive, "Reserve already initialized");
        require(collateralFactor <= PERCENTAGE_FACTOR, "Invalid collateral factor");
        require(liquidationThreshold <= PERCENTAGE_FACTOR, "Invalid liquidation threshold");
        require(liquidationThreshold >= collateralFactor, "Liquidation threshold must be >= collateral factor");

        reserves[asset] = ReserveData({
            totalSupply: 0,
            totalBorrow: 0,
            liquidityRate: liquidityRate,
            borrowRate: borrowRate,
            liquidityIndex: RATE_PRECISION,
            borrowIndex: RATE_PRECISION,
            lastUpdateTimestamp: block.timestamp,
            isActive: true,
            canSupply: true,
            canBorrow: true,
            collateralFactor: collateralFactor,
            liquidationThreshold: liquidationThreshold
        });

        reservesList.push(asset);
        emit ReserveInitialized(asset);
    }

    /**
     * @dev Supply assets to the pool
     * @param asset The address of the asset to supply
     * @param amount The amount to supply
     */
    function supply(address asset, uint256 amount) external nonReentrant onlyActiveReserve(asset) {
        require(amount > 0, "Amount must be greater than 0");
        require(reserves[asset].canSupply, "Supply is not enabled for this asset");

        updateReserveIndexes(asset);

        UserReserveData storage userReserve = userReserves[msg.sender][asset];
        ReserveData storage reserve = reserves[asset];

        // Calculate current supply balance
        uint256 currentSupplyBalance = getUserSupplyBalance(msg.sender, asset);
        
        // Update user's principal and index
        userReserve.principalSupply = currentSupplyBalance.add(amount);
        userReserve.lastSupplyIndex = reserve.liquidityIndex;

        // Update reserve total supply
        reserve.totalSupply = reserve.totalSupply.add(amount);

        // Transfer tokens to the contract
        IERC20(asset).safeTransferFrom(msg.sender, address(this), amount);

        emit Supply(msg.sender, asset, amount);
    }

    /**
     * @dev Withdraw supplied assets from the pool
     * @param asset The address of the asset to withdraw
     * @param amount The amount to withdraw (0 for max)
     */
    function withdraw(address asset, uint256 amount) external nonReentrant onlyActiveReserve(asset) {
        updateReserveIndexes(asset);

        UserReserveData storage userReserve = userReserves[msg.sender][asset];
        ReserveData storage reserve = reserves[asset];

        uint256 currentSupplyBalance = getUserSupplyBalance(msg.sender, asset);
        require(currentSupplyBalance > 0, "No supply balance");

        uint256 withdrawAmount = amount;
        if (amount == 0) {
            withdrawAmount = currentSupplyBalance;
        }
        
        require(withdrawAmount <= currentSupplyBalance, "Insufficient supply balance");
        require(withdrawAmount <= reserve.totalSupply, "Insufficient liquidity");

        // Check if user has enough collateral after withdrawal
        if (userReserve.useAsCollateral) {
            require(_isWithdrawalAllowed(msg.sender, asset, withdrawAmount), "Withdrawal would make position unhealthy");
        }

        // Update user's principal and index
        userReserve.principalSupply = currentSupplyBalance.sub(withdrawAmount);
        userReserve.lastSupplyIndex = reserve.liquidityIndex;

        // Update reserve total supply
        reserve.totalSupply = reserve.totalSupply.sub(withdrawAmount);

        // Transfer tokens to user
        IERC20(asset).safeTransfer(msg.sender, withdrawAmount);

        emit Withdraw(msg.sender, asset, withdrawAmount);
    }

    /**
     * @dev Borrow assets from the pool
     * @param asset The address of the asset to borrow
     * @param amount The amount to borrow
     */
    function borrow(address asset, uint256 amount) external nonReentrant onlyActiveReserve(asset) {
        require(amount > 0, "Amount must be greater than 0");
        require(reserves[asset].canBorrow, "Borrow is not enabled for this asset");

        updateReserveIndexes(asset);

        UserReserveData storage userReserve = userReserves[msg.sender][asset];
        ReserveData storage reserve = reserves[asset];

        require(amount <= _getAvailableLiquidity(asset), "Insufficient liquidity");
        require(_isBorrowAllowed(msg.sender, asset, amount), "Borrow would make position unhealthy");

        // Calculate current borrow balance
        uint256 currentBorrowBalance = getUserBorrowBalance(msg.sender, asset);

        // Update user's principal and index
        userReserve.principalBorrow = currentBorrowBalance.add(amount);
        userReserve.lastBorrowIndex = reserve.borrowIndex;

        // Update reserve total borrow
        reserve.totalBorrow = reserve.totalBorrow.add(amount);

        // Transfer tokens to user
        IERC20(asset).safeTransfer(msg.sender, amount);

        emit Borrow(msg.sender, asset, amount);
    }

    /**
     * @dev Repay borrowed assets
     * @param asset The address of the asset to repay
     * @param amount The amount to repay (0 for max)
     */
    function repay(address asset, uint256 amount) external nonReentrant onlyActiveReserve(asset) {
        updateReserveIndexes(asset);

        UserReserveData storage userReserve = userReserves[msg.sender][asset];
        ReserveData storage reserve = reserves[asset];

        uint256 currentBorrowBalance = getUserBorrowBalance(msg.sender, asset);
        require(currentBorrowBalance > 0, "No borrow balance");

        uint256 repayAmount = amount;
        if (amount == 0 || amount > currentBorrowBalance) {
            repayAmount = currentBorrowBalance;
        }

        // Update user's principal and index
        userReserve.principalBorrow = currentBorrowBalance.sub(repayAmount);
        userReserve.lastBorrowIndex = reserve.borrowIndex;

        // Update reserve total borrow
        reserve.totalBorrow = reserve.totalBorrow.sub(repayAmount);

        // Transfer tokens from user
        IERC20(asset).safeTransferFrom(msg.sender, address(this), repayAmount);

        emit Repay(msg.sender, asset, repayAmount);
    }

    /**
     * @dev Toggle an asset as collateral
     * @param asset The address of the asset
     * @param useAsCollateral Whether to use as collateral
     */
    function setUserUseReserveAsCollateral(address asset, bool useAsCollateral) external onlyActiveReserve(asset) {
        UserReserveData storage userReserve = userReserves[msg.sender][asset];
        
        if (!useAsCollateral) {
            // Check if user can disable collateral
            require(_canDisableCollateral(msg.sender, asset), "Cannot disable collateral - would make position unhealthy");
        }

        userReserve.useAsCollateral = useAsCollateral;
        emit CollateralToggled(msg.sender, asset, useAsCollateral);
    }

    /**
     * @dev Get user's current supply balance including accrued interest
     */
    function getUserSupplyBalance(address user, address asset) public view returns (uint256) {
        UserReserveData memory userReserve = userReserves[user][asset];
        if (userReserve.principalSupply == 0) {
            return 0;
        }

        ReserveData memory reserve = reserves[asset];
        uint256 currentLiquidityIndex = _getCurrentLiquidityIndex(asset);
        
        return userReserve.principalSupply.mul(currentLiquidityIndex).div(userReserve.lastSupplyIndex);
    }

    /**
     * @dev Get user's current borrow balance including accrued interest
     */
    function getUserBorrowBalance(address user, address asset) public view returns (uint256) {
        UserReserveData memory userReserve = userReserves[user][asset];
        if (userReserve.principalBorrow == 0) {
            return 0;
        }

        uint256 currentBorrowIndex = _getCurrentBorrowIndex(asset);
        
        return userReserve.principalBorrow.mul(currentBorrowIndex).div(userReserve.lastBorrowIndex);
    }

    /**
     * @dev Get user's account data (total collateral, total debt, health factor)
     */
    function getUserAccountData(address user) external view returns (
        uint256 totalCollateralValue,
        uint256 totalDebtValue,
        uint256 healthFactor
    ) {
        return _getUserAccountData(user);
    }

    /**
     * @dev Update reserve indexes based on time elapsed
     */
    function updateReserveIndexes(address asset) public {
        ReserveData storage reserve = reserves[asset];
        
        if (block.timestamp == reserve.lastUpdateTimestamp) {
            return;
        }

        uint256 timeDelta = block.timestamp.sub(reserve.lastUpdateTimestamp);
        
        // Update liquidity index
        uint256 liquidityRate = reserve.liquidityRate;
        if (liquidityRate > 0) {
            uint256 cumulatedLiquidityInterest = liquidityRate.mul(timeDelta).div(SECONDS_PER_YEAR).add(RATE_PRECISION);
            reserve.liquidityIndex = reserve.liquidityIndex.mul(cumulatedLiquidityInterest).div(RATE_PRECISION);
        }

        // Update borrow index
        uint256 borrowRate = reserve.borrowRate;
        if (borrowRate > 0) {
            uint256 cumulatedBorrowInterest = borrowRate.mul(timeDelta).div(SECONDS_PER_YEAR).add(RATE_PRECISION);
            reserve.borrowIndex = reserve.borrowIndex.mul(cumulatedBorrowInterest).div(RATE_PRECISION);
        }

        reserve.lastUpdateTimestamp = block.timestamp;
    }

    /**
     * @dev Set asset price (in production, use oracle)
     */
    function setAssetPrice(address asset, uint256 price) external onlyOwner {
        assetPrices[asset] = price;
    }

    /**
     * @dev Get reserve data
     */
    function getReserveData(address asset) external view returns (ReserveData memory) {
        return reserves[asset];
    }

    /**
     * @dev Get available liquidity for an asset
     */
    function _getAvailableLiquidity(address asset) internal view returns (uint256) {
        return IERC20(asset).balanceOf(address(this));
    }

    /**
     * @dev Calculate current liquidity index
     */
    function _getCurrentLiquidityIndex(address asset) internal view returns (uint256) {
        ReserveData memory reserve = reserves[asset];
        
        if (block.timestamp == reserve.lastUpdateTimestamp) {
            return reserve.liquidityIndex;
        }

        uint256 timeDelta = block.timestamp.sub(reserve.lastUpdateTimestamp);
        uint256 liquidityRate = reserve.liquidityRate;
        
        if (liquidityRate == 0) {
            return reserve.liquidityIndex;
        }

        uint256 cumulatedLiquidityInterest = liquidityRate.mul(timeDelta).div(SECONDS_PER_YEAR).add(RATE_PRECISION);
        return reserve.liquidityIndex.mul(cumulatedLiquidityInterest).div(RATE_PRECISION);
    }

    /**
     * @dev Calculate current borrow index
     */
    function _getCurrentBorrowIndex(address asset) internal view returns (uint256) {
        ReserveData memory reserve = reserves[asset];
        
        if (block.timestamp == reserve.lastUpdateTimestamp) {
            return reserve.borrowIndex;
        }

        uint256 timeDelta = block.timestamp.sub(reserve.lastUpdateTimestamp);
        uint256 borrowRate = reserve.borrowRate;
        
        if (borrowRate == 0) {
            return reserve.borrowIndex;
        }

        uint256 cumulatedBorrowInterest = borrowRate.mul(timeDelta).div(SECONDS_PER_YEAR).add(RATE_PRECISION);
        return reserve.borrowIndex.mul(cumulatedBorrowInterest).div(RATE_PRECISION);
    }

    /**
     * @dev Get user's account data
     */
    function _getUserAccountData(address user) internal view returns (
        uint256 totalCollateralValue,
        uint256 totalDebtValue,
        uint256 healthFactor
    ) {
        for (uint256 i = 0; i < reservesList.length; i++) {
            address asset = reservesList[i];
            UserReserveData memory userReserve = userReserves[user][asset];
            ReserveData memory reserve = reserves[asset];
            uint256 assetPrice = assetPrices[asset];

            // Calculate collateral value
            if (userReserve.useAsCollateral && userReserve.principalSupply > 0) {
                uint256 supplyBalance = getUserSupplyBalance(user, asset);
                uint256 collateralValue = supplyBalance.mul(assetPrice).mul(reserve.collateralFactor).div(PERCENTAGE_FACTOR);
                totalCollateralValue = totalCollateralValue.add(collateralValue);
            }

            // Calculate debt value
            if (userReserve.principalBorrow > 0) {
                uint256 borrowBalance = getUserBorrowBalance(user, asset);
                uint256 debtValue = borrowBalance.mul(assetPrice);
                totalDebtValue = totalDebtValue.add(debtValue);
            }
        }

        // Calculate health factor
        if (totalDebtValue == 0) {
            healthFactor = type(uint256).max;
        } else {
            healthFactor = totalCollateralValue.mul(RATE_PRECISION).div(totalDebtValue);
        }
    }

    /**
     * @dev Check if borrow is allowed
     */
    function _isBorrowAllowed(address user, address asset, uint256 amount) internal view returns (bool) {
        (uint256 totalCollateralValue, uint256 totalDebtValue,) = _getUserAccountData(user);
        
        uint256 assetPrice = assetPrices[asset];
        uint256 additionalDebt = amount.mul(assetPrice);
        uint256 newTotalDebt = totalDebtValue.add(additionalDebt);
        
        return newTotalDebt <= totalCollateralValue;
    }

    /**
     * @dev Check if withdrawal is allowed
     */
    function _isWithdrawalAllowed(address user, address asset, uint256 amount) internal view returns (bool) {
        ReserveData memory reserve = reserves[asset];
        uint256 assetPrice = assetPrices[asset];
        
        (uint256 totalCollateralValue, uint256 totalDebtValue,) = _getUserAccountData(user);
        
        if (totalDebtValue == 0) {
            return true;
        }
        
        uint256 collateralReduction = amount.mul(assetPrice).mul(reserve.collateralFactor).div(PERCENTAGE_FACTOR);
        uint256 newTotalCollateral = totalCollateralValue.sub(collateralReduction);
        
        return newTotalCollateral >= totalDebtValue;
    }

    /**
     * @dev Check if user can disable collateral
     */
    function _canDisableCollateral(address user, address asset) internal view returns (bool) {
        ReserveData memory reserve = reserves[asset];
        UserReserveData memory userReserve = userReserves[user][asset];
        
        if (userReserve.principalSupply == 0) {
            return true;
        }
        
        (uint256 totalCollateralValue, uint256 totalDebtValue,) = _getUserAccountData(user);
        
        if (totalDebtValue == 0) {
            return true;
        }
        
        uint256 supplyBalance = getUserSupplyBalance(user, asset);
        uint256 assetPrice = assetPrices[asset];
        uint256 collateralReduction = supplyBalance.mul(assetPrice).mul(reserve.collateralFactor).div(PERCENTAGE_FACTOR);
        uint256 newTotalCollateral = totalCollateralValue.sub(collateralReduction);
        
        return newTotalCollateral >= totalDebtValue;
    }
}
pragma solidity ^0.5.0;

contract RenewableEnergyExchange {
    string public name;
    uint public transactionCount = 0;
    mapping(uint => Transaction) public transactions;

    struct Transaction {
        uint256 transactionId;
        address payable buyer;
        address payable seller;
        uint256 energyAmount;
        uint256 price;
        uint256 startDate;
        uint256 endDate;
        bool completed;
    }

    event TransactionCreated(
        uint256 transactionId,
        address payable buyer,
        address payable seller,
        uint256 energyAmount,
        uint256 price,
        uint256 startDate,
        uint256 endDate,
        bool completed
    );

    event TransactionCompleted(
        uint256 transactionId,
        address payable buyer,
        address payable seller,
        uint256 energyAmount,
        uint256 price,
        uint256 startDate,
        uint256 endDate,
        bool completed
    );

    constructor() public {
        name = "Plataforma de intercambio de energia renovable";
    }

    function createContract(
        address payable _buyer,
        uint256 _energyAmount,
        uint256 _price,
        uint256 _duration
    ) public {
        require(_buyer != address(0), "Invalid buyer address");
        require(_energyAmount > 0, "Energy amount must be greater than 0");
        require(_price > 0, "Price must be greater than 0");

        transactionCount++;
        Transaction memory newTransaction = Transaction(
            transactionCount,
            _buyer,
            msg.sender,
            _energyAmount,
            _price,
            block.timestamp,
            block.timestamp + _duration,
            false
        );
        transactions[transactionCount] = newTransaction;

        emit TransactionCreated(
            transactionCount,
            _buyer,
            msg.sender,
            _energyAmount,
            _price,
            block.timestamp,
            block.timestamp + _duration,
            false
        );
    }

    function completeTransaction(uint256 _transactionId) public payable {
        Transaction storage transaction = transactions[_transactionId];
        require(
            msg.sender == transaction.buyer,
            "Only the buyer can complete the transaction"
        );
        require(msg.value >= transaction.price, "Insufficient funds");
        require(!transaction.completed, "Transaction is already completed");

        transaction.seller.transfer(transaction.price);
        transaction.completed = true;

        // update the transaction
        transactions[_transactionId] = transaction;

        emit TransactionCompleted(
            transaction.transactionId,
            transaction.buyer,
            transaction.seller,
            transaction.energyAmount,
            transaction.price,
            transaction.startDate,
            transaction.endDate,
            true
        );
    }

    function getTransaction(
        uint256 _transactionId
    )
        public
        view
        returns (
            // return as a struct
            uint256,
            address,
            address,
            uint256,
            uint256,
            uint256,
            uint256,
            bool
        )
    {
        Transaction storage transaction = transactions[_transactionId];
        return (
            transaction.transactionId,
            transaction.buyer,
            transaction.seller,
            transaction.energyAmount,
            transaction.price,
            transaction.startDate,
            transaction.endDate,
            transaction.completed
        );
    }
}

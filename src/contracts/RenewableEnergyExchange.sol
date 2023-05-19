pragma solidity ^0.5.0;

contract RenewableEnergyExchange {
    string public name;
    uint public energyContractCount = 0;
    mapping(uint => EnergyContract) public energyContracts;

    struct EnergyContract {
        uint256 energyContractId;
        address payable buyer;
        address payable seller;
        uint256 energyAmount;
        uint256 price;
        uint256 startDate;
        uint256 endDate;
        bool completed;
    }

    event EnergyContractCreated(
        uint256 energyContractId,
        address payable buyer,
        address payable seller,
        uint256 energyAmount,
        uint256 price,
        uint256 startDate,
        uint256 endDate,
        bool completed
    );

    event EnergyContractCompleted(
        uint256 energyContractId,
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

    function createEnergyContract(
        uint256 _energyAmount,
        uint256 _price,
        uint256 _duration
    ) public {
        require(_energyAmount > 0, "Energy amount must be greater than 0");
        require(_price > 0, "Price must be greater than 0");

        energyContractCount++;
        EnergyContract memory newEnergyContract = EnergyContract(
            energyContractCount,
            address(0), // Set buyer to zero address
            msg.sender,
            _energyAmount,
            _price,
            block.timestamp,
            block.timestamp + _duration,
            false
        );
        energyContracts[energyContractCount] = newEnergyContract;

        emit EnergyContractCreated(
            energyContractCount,
            address(0), // Emit zero address as buyer
            msg.sender,
            _energyAmount,
            _price,
            block.timestamp,
            block.timestamp + _duration,
            false
        );
    }

    function completeEnergyContract(uint256 _energyContractId) public payable {
        EnergyContract storage energyContract = energyContracts[
            _energyContractId
        ];
        require(msg.value >= energyContract.price, "Insufficient funds");
        require(
            !energyContract.completed,
            "EnergyContract is already completed"
        );
        require(
            msg.sender != energyContract.seller,
            "Buyer cannot be the seller"
        );

        energyContract.buyer = msg.sender; // Set buyer to the address that calls this function
        energyContract.seller.transfer(energyContract.price);
        energyContract.completed = true;

        // update the energyContract
        energyContracts[_energyContractId] = energyContract;

        emit EnergyContractCompleted(
            energyContract.energyContractId,
            energyContract.buyer,
            energyContract.seller,
            energyContract.energyAmount,
            energyContract.price,
            energyContract.startDate,
            energyContract.endDate,
            true
        );
    }

    function getEnergyContract(
        uint256 _energyContractId
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
        EnergyContract storage energyContract = energyContracts[
            _energyContractId
        ];
        return (
            energyContract.energyContractId,
            energyContract.buyer,
            energyContract.seller,
            energyContract.energyAmount,
            energyContract.price,
            energyContract.startDate,
            energyContract.endDate,
            energyContract.completed
        );
    }
}

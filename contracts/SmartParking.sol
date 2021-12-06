pragma solidity ^0.5.0;

contract SmartParking {
    uint public spotCount = 0;

    struct Spot {
        uint id;
        string content;
        bool completed;
    }

    mapping(uint => Spot) public spots;
event SpotCreated(
    uint id,
    string content,
    bool completed
  );

event SpotCompleted(
    uint id,
    bool completed
  );
constructor() public {
        createSpot("welcome to our website");   
    }

  
    function createSpot(string memory _content) public {
        spotCount++;
        spots[spotCount] = Spot(spotCount, _content, false);
        emit SpotCreated(spotCount, _content, false);
    }
    

  function toggleCompleted(uint _id) public {
    Spot memory _task = spots[_id];
    _task.completed = !_task.completed;
    spots[_id] = _task;
    emit SpotCompleted(_id, _task.completed);
  }
    
 


}


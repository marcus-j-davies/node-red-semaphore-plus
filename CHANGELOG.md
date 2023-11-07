# node-red-semaphore-plus Change Log

- 3.3.0
      
   **New Features**
  
    - Both the `Take` and `FS Reset` Nodes, now includes a new output property.
      `smp_appliedFailsafe` This denotes what fail-safe was applied for this `msg` allowing reference to the current fail-safe time.
      You can, for example, use its value to decide on an updated fail-safe time.


   **Changes**

    - Improvements to the node Status.
    - Improvements to node help, and **README**


- 3.2.0
      
   **New Features**
  
    - Add support for `msg.reset` to stop message propergation on the `Release` node

  **Fixes**
  
    - Check if a permit is undefined before executing an atomic Release

- 3.1.0
      
   **New Features**
  
    - You can now reset the lock (which will dispose of all messages)
      To do this, send a property of `msg.smp_reset = true` to the `Release` Node

   **Changes**

    - The color of the status in the `Take` Node , now denotes wheather or not a message will be queued 
      Where a dot denotes if this `Take` has queued messages, and a ring denoets that it does not. 


- 3.0.3
      
   **Changes**
  
    - Read Me edit
    - Docs typo

- 3.0.2
      
   **Changes**
  
    - Improve Layout/input icons
    - Add Node documentation 

- 3.0.1
      
   **Bug Fixes**
  
    - Add `license`

- 3.0.0
      
   **Breaking Changes**
  
    - The `Semaphore Take` node has been updated to now allow `JSONata` or `msg` evaulation,
      that is then used to denote if the `msg` is allowed to avoid the Semaphore Queue


- 2.0.0
      
   **Breaking Changes**
  
    - The follwoing properties have been renamed:  
      `sp_timeout` -> `smp_failsafeTimeout`  
      `sp_isFailesafe` -> `smp_isFailesafe`

   **Bug Fixes**
  
    - Initial node states were not correct

- 1.1.0
      
   **New Features**
  
    - Messages are now passed through with a property of `sp_isFailsafe` denoting whether or not it was released due to a fail safe trigger 

- 1.0.2
      
   **Bug Fixes**
  
    - Fix package.json

- 1.0.1
      
   **Bug Fixes**
  
    - Fix package.json
  
  
- 1.0.0
    - Initial Release

    



  # node-red-semaphore-plus Change Log

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

    



# node-red-semaphore-plus
An advanced semaphore Node for Node RED, with a dynamic fail-safe

### Uh... what is it

This is a set of Nodes for Node RED, that allows messages to be queued, and signalled to pass, once a message has reached the end of the flow.
But at the same time, allowing an optional fail-safe, that can be controlled dynamically.

| Node | What's it for? |
|------|----------------|
|Semaphore Take | Queues and passes a message through when signalled (or when the optional fail-safe triggers) |
|Semaphore Release | Raises the signal to allow a message to pass   |
|Semaphore FS Reset | Alters the current fail-safe time |

The fail-safe time is set at Node level (**Semaphore Take**, **Semaphore FS Reset**),  
But! You can also pass in a msg property of `sp_timeout` and the nodes will ignore what is set at Node level, and sue this value instead

Setting the fail-safe to 0 (zero) will disable the fail-safe, meaning **Semaphore Release** will be the only node that can release the lock

If nothing has already taken the lock, the message will of course pass through  

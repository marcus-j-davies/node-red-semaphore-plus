# node-red-semaphore-plus
An advanced set of semaphore Nodes for Node RED, with a dynamic fail-safe

## Uh... what is it

This is a set of Nodes for Node RED, that allows messages to be queued, and signalled to pass, once a message has reached the end of the flow.
But at the same time, allowing an optional fail-safe, that can be controlled dynamically.

| Node | What's it for? |
|------|----------------|
|Semaphore Take | Queues and passes a message through when signalled (or when the optional fail-safe triggers) |
|Semaphore Release | Raises the signal to allow a message to pass   |
|Semaphore FS Reset | Alters the current fail-safe time |

The fail-safe time is set at Node level (**Semaphore Take**, **Semaphore FS Reset**),  
But! You can also pass in a msg property of `sp_timeout` and the nodes will ignore what is set at Node level, and use this value instead

Setting the fail-safe to 0 (zero) will disable the fail-safe, meaning **Semaphore Release** will be the only node that can release the lock

If nothing has already taken the lock, the message will of course pass through, and subsequently start queing other messages, where each one is allowed to pass on the signal or fail-safe trigger 


## Yeah but why?

Working in an enterprise environment, where strict API access is enforced/monitored, I needed to come up with a way to control processing.
Having tried other nodes to accomplish this, I was iether creating messy flows to try and emulate this approch, or using no longer maintained or buggy nodes.

## License
MIT License

Copyright (c) 2023 Marcus Davies

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

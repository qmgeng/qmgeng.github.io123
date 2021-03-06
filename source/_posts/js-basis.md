layout: art
title: JavaScript一些基础知识简介
subtitle: 作用域链、原型链、闭包、UI线程
tags: 
- JavaScript
categories: 
- JS技术
date: 2014/3/28
---

最近看笔试面试题时，总是看到问这些JavaScript基础知识，所以在这里总结了一下原型链、作用域链、闭包和UI线程的知识基础，希望以后问到的时候能答得上来

<!-- more -->


##作用域链基础知识
###作用域链
每一个JavaScript函数都会被表示为一个函数对象，它和其他对象一样，拥有自己的属性，其中有一些是JavaScript引擎所使用的内部属性，不允许外部访问，`[[scope]]`就是其中一个

###scope属性
内部`[[scope]]`属性包含一个函数被创建的作用域对象的集合，被称为作用域链。它决定函数可以访问哪些属性。作用域链中的每个对象都被称为一个VO（Variable Object），每个VO都以“键值对”的形式存在。当一个函数创建以后，它的作用域链就会被填充，这些对象代表创建此函数的环境中可访问的数据。

###创建运行期上下文
在函数运行时，会创建一个内部对象，称为运行期上下文（Execution Context，也叫EC），这个运行期上下文在创建后回访制在“运行期栈”中，和其他语言的函数调用的栈类似。一个运行期上下文定义了一个函数运行时的环境。函数的每次运行都会创建一个运行期上下文，每次创建的运行期上下文相互独立。当函数执行完毕时，运行期上下文就会被销毁

###复制作用域链 
一个运行期上下文有自己的作用域链，用于标识符解析。当运行期上下文被创建时，它的作用域链被初始化，并将所运行函数的`[[scope]]`中的VO对象按照顺序复制到运行期上下文自己的作用域链中

###AO对象的创建
在复制完函数的作用域链之后，就会创建一个被称为AO（Activation Object）的对象，这个对象包含了以下内容：
1. this
2. 局部变量
3. 命名参数
4. arguments集合

创建完成AO对象后，它江北推入作用域链的最前端。作用域链被销毁时，AO也会一并销毁

###标示符解析
函数运行过程中，每遇到一个变量，标识符都需要决定需要从哪里获得数据。这个搜索过程会顺着运行期上下文的作用域链来查找。大致上流程如下：
1. 索引一个AO或VO
2. 查找其中的局部变量
3. 查找其中的命名参数
4. 如果没找到，查找下一个AO或VO，如果有则转到1，否则转到5
5. 输出标识符未定义

###with和try-catch改变作用域链
一般来说，运行期上下文的作用域链是不会被改变的。但是使用`with`和`try-catch`可以对作用域链进行临时改变。

with所做的就是在作用域链前端再插入一个VO，with所指定的对象的所有属性，都会被插入到这个VO中。由此，访问with所指定的对象的属性速度将会加快，但由于增长了作用域链的长度，访问其他属性将会减慢。所以使用with不如直接使用一个变量来暂存with所指定的对象

try-catch中的catch块也有相同的效果，在catch块中，会将异常对象构造成一个VO，插入到运行时上下文的作用域链的最前端。同样会加长作用域链，导致性能下降。解决办法就是在catch块中调用一个处理函数，所有的逻辑放在处理函数之中。

##闭包
闭包的强大在于它允许函数访问局部范围之外的数据。当一个函数被执行时，会创建一个AO，而如果在函数执行时创建了闭包，当前运行期上下文的作用域链将复制到闭包的作用域链中

由于闭包的作用域链与运行期上下文作用域链中的引用相同，这也就是说在函数的AO与运行期上下文一同销毁时，由于闭包的存在，AO中的对象依旧早闭包的作用域链中被引用，导致JavaScript的垃圾回收器认为AO中的对象已然是活对象，而不会对其进行垃圾回收。所以闭包将会导致更多的内存开销

##原型链
###原型
我们都知道JavaScript是基于对象的语言，原型是对象的基础。一个对象通过内部属性绑定到它的原型，在一些浏览器如FF，Safari，Chrome中可以使用`__proto__`来访问对象的原型。当创建一个内置类型的实例时，这些实例自动拥有一个Object作为它们的原型

###创建对象
在对象被创建时，对象的`__proto__`属性指向其构造函数的`prototype`属性，而如果一个函数没有指定prototype属性，那么这个属性将默认为一个空的`Object`，而`Object.prototype.__proto__`为`null`

比如如下情况：
```javascript
> function A(){}
> new A().__proto__ === A.prototype
true
> A.prototype.__proto__
Object {}
> A.prototype.__proto__.__proto__
null
```

###原型链
由此，我们可以将一个构造好的对象传递给另一个需要构造的对象的构造函数的`prototype`属性，这样新构造函数所构造的对象的`__proto__`自然就指向之前构造好的对象了。这就是原型链

当查找一个对象的属性的时候，如果遍历对象当前的所有属性，如果不存在，就会顺着原型链一层一层遍历原型链上的对象，直到查找成功

比如如下实例：
```javascript
> function A(){this.a = "In A"}
> A.prototype = {ap : "In A.prototype"};
> function B(){this.b = "In B"}
> B.prototype = new A()
> var b = new B()
> console.log(b.a)
"In A"
> console.log(b.ap)
"In A.prototype"
> console.log(b.b)
"In B"
```
这里由于将A的实例复制给了B构造函数的`prototype`属性，所以B的实例的`__proto__`就指向这个A的实例

在查找a属性的时候，首先在这个B的实例中查找，发现没有，顺着原型链到达A实例，发现了这个属性，输出，所以为`"In A"`

在查找ap属性的时候，首先在B的实例中查找，发现没有，顺着原型链到达A实例，发现没有，顺着原型链达到A.prototype的对象，发现属性，所以输出`"In A.prototype"`

在查找b属性的时候，在B的实例中查找，找到了，所以直接输出`"In B"`

###基于原型的继承
上面可以看到，其实就是一种继承的方式。JavaScript中的继承就是使用这种原型继承方式来实现的。上例中B继承了A，一般情况下我们希望使用`instanceof`来确定对象是哪种对象。比如使用`instanceof`检测B的实例时，无论是检测B还是A还是Object，都应该返回true

`object instanceof constructor`的实际行为是检测`constructor.prototype`是否存在于`object`的原型链上

```javascript
> function A(){};
> function B(){};
> B.prototype = new A();
> var b = new B();
> b instanceof A
true
> b instanceof B
true
> b instanceof Object
true
```


###constructor属性
上例可以看到使用`instanceof`属性可以进行检测，而对象中还有一个constructor属性，指向其构造函数

```javascript
> function A (){}
> new A().__proto__.constructor === A
true
```

constructor这个属性是在创建构造函数时赋值到构造函数的prototype属性中的。而这时，这个constructor指向这个构造函数本身

```javascript
> function A(){}
> A === A.prototype.constructor
true
```

而上面我们说了，在使用构造函数创建实例的时候，会将构造函数的`prototype`属性传递给实例的`__proto__`属性，所以实例的constructor属性就能指向自己的构造函数了

然而，当我们使用了如上面A和B的继承方式时，就变化了：
```javascript
> function A(){}
> function B(){}
> B.prototype = new A();
> var b = new B();
> b.constructor
function A(){}
```
输出的是构造函数A而不是构造函数B

这是因为B的prototype属性已经被覆盖成`new A()`所创建的A的实例，A的实例中，constructor属性指向的自然是A构造函数。具体的索引过程如下：
1. 查找b对象的constructor属性，没找到
2. 查找`b.__proto__`对象，也就是`new A()`所创建的A实例，没有找到
3. 查找A实例的`__proto__`对象，也就是`A.prototype`，找到了constructor属性，返回

如果这样继承，就容易出现错误，所以我们需要手动将B构造函数赋值给它自己的`prototype`属性，将上面的继承改成如下这样：
```javascript
> function A(){}
> function B(){}
> B.prototype = new A();
> B.prototype.constructor = B;
> var b = new B();
> b.constructor
function B(){}
```

这样就是我们想要的结果了

###一些其他的乱七八糟
JavaScript除了该死的constructor以外，还有一些坑，比如Array.prototype其实是个数组实例：
```javascript
> Array.prototype
[]
```

##UI线程
###基础概念
大多数浏览器只有一个单独的处理线程，它由两个任务共享：JavaScript任务和用户界面更新任务，每个时刻只有一个操作得以执行。当JavaScript代码执行时，用户界面就会被“锁定”，反过来也是一样。他们所共享的这个线程就被称为UI线程

比如一次按钮点击，会依次将按钮样式改变、按钮点击时需要运行的JavaScript代码、代码中的UI改变依次加入到UI线程中

###浏览器的限制
浏览器除了会限制运行期栈的深度以外，还会限制长时间执行脚本。不同的浏览器判断脚本执行时间过长的方法不一样，有的是通过时间来判断，有的是通过运行语句的条数判断

###应当运行多久
一个单一的JavaScript操作所使用的最大时间应该是100ms，如果用户100ms之内无法收到接口呃响应，用户就会认为自己与接口断开了

###定时相关
JavaScript中有两种定时器，`setTimeout`和`setInterval`，使用它们能将较长的任务分解成较短的任务

使用定时器时，比如如下代码：
```javascript
setTimeout(function(){
    //do something
}, 250);
```
在这句`setTimeout`指令执行后的250ms（不一定精确），将函数加入到UI线程中。需要注意的是，这里不是立刻加入UI线程中，而是到了时间才加入。

> 另外我曾看过一篇文章，讲述的是setTimeout和setInterval执行后，会将其内设定到时需要执行的代码放入一个红黑树中，而每次执行时会从红黑树中挑选出当前最先需要执行的代码，放入UI线程中，同时维护红黑树。这个概念不太明确，有待考证

这样我们可以看到，只有当前任务执行完之后，才有可能去执行UI队列中的其他任务，所以如下代码：
```javascript
console.log(1);
setTimeout(function() {
    console.log(2);
}, 0);
console.log(3);
```
输出的结果实际上是132

###定时器的精度问题
JavaScript的定时器往往不太准确（当然requestAnimationFrame要精确得多），快慢大约几毫秒。而此外最小定时器延时的设定也会影响运行，在IE中建议的最小值为25ms

###定时器分解任务
我们可以将任务分解成一系列子任务，然后将其分别通过定时器加入到UI线程中，以此来保证每个子任务运行时间不超过100ms（最好是不超过50ms），让UI更新和响应任务也能够及时处理。其实这个思想和JavaScript引擎的垃圾回收器的迭代处理相似


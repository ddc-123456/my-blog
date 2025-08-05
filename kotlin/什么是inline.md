# Kotlin 中的 inline 关键字详解

## 一、什么是 inline？

inline 是 Kotlin 中用于修饰函数的关键字，它的核心作用是**在编译阶段将函数代码直接 "复制粘贴" 到调用处**，而不是通过传统的函数调用方式（跳转、执行、返回）运行。

可以理解为：

- 普通函数调用 = 自己去快递点取件（需要来回跑路）

- inline 函数调用 = 快递直接送上门（代码直接送到调用处）



咱们可以把 inline 想象成 “快递上门” 和 “自己取件” 的区别 ——

平时咱们写代码调用函数，就像网购后自己去快递点取件：你得停下手里的事，走到快递点（函数跳转），拿了东西（执行函数逻辑），再走回来（返回原位置）。如果这个函数还带了个 lambda 表达式（比如 { ... } 里的代码），就好比取件时还得带个空袋子装东西，每次取件都得新做一个袋子（编译时会生成匿名类对象），来回跑加做袋子，次数多了就挺费劲儿。

而 inline 关键字，就相当于 “快递直接送上门”：快递员（编译器）会把你要买的东西（函数里的代码）和袋子里的东西（lambda 里的代码），直接打包送到你家（调用函数的地方），拆开摆好。这样你不用来回跑（省去函数调用的跳转开销），也不用每次都做新袋子（lambda 代码直接嵌在原地，不生成匿名类），效率自然就高了。

举个例子：

你写了个 inline fun goShopping(what: () -> String) { ... }，调用时 goShopping { "买牛奶" }。

编译器会直接把 goShopping 里的代码和 { "买牛奶" } 里的内容，像拼积木一样直接 “粘” 在调用的地方，就像你直接写了一整段 “买牛奶” 的代码，没有中间的 “取件” 步骤。

那 noinline 和 crossinline 是啥？

- noinline 就像有些东西必须自己去取：比如你买的是个大冰箱，快递员送不了上门，只能你自己去取（这个 lambda 不内联，保留成对象，能像普通变量一样传递）。

- crossinline 就像快递员提醒你：“东西放门口就行，别进屋乱逛”。有些 lambda 会在别的地方执行（比如新线程里），如果允许它随便 “跑回” 原来的代码里（非局部返回），会出乱子。crossinline 就是加个限制，让它乖乖在自己的范围里执行。

总结一下：inline 就是让函数代码 “就地展开”，省去调用开销，尤其适合带 lambda 的小函数，让代码跑得更快、更省资源～

## 二、为什么需要 inline？

主要解决**高阶函数（带 lambda 参数的函数）的性能问题**：

Kotlin 中，lambda 表达式会被编译成匿名类对象，频繁调用这类函数会导致：

1. 大量匿名类对象创建 → 增加内存开销

1. 频繁的函数跳转 → 降低执行效率

inline 通过 "代码内联" 避免了这两个问题，尤其适合频繁调用的高阶函数（如 Kotlin 标准库中的 let、run、forEach 等）。

## 三、基本用法

用 inline 修饰函数，编译时会将函数体和 lambda 代码直接插入到调用处：

```kotlin
// 定义 inline 函数
inline fun log(message: () -> String) {
    println("Log: ${message()}")
}

// 调用时
fun main() {
    log { "Hello, inline!" }  // 编译后等价于：println("Log: Hello, inline!")
}
```

## 四、与其他关键字的配合

### 1. noinline：阻止 lambda 内联

inline 会默认内联所有 lambda 参数，但有时需要将 lambda 作为对象传递（如赋值给变量、传给非内联函数），这时要用 noinline 标记：

```kotlin
inline fun process(
    inlineFunc: () -> Unit,  // 会被内联
    noinline noInlineFunc: () -> Unit  // 不会被内联（保留为对象）
) {
    inlineFunc()
    val func = noInlineFunc  // 非内联的 lambda 才能赋值给变量
    func()
}
```

### 2. crossinline：限制 lambda 的 "非局部返回"

内联函数中的 lambda 允许 "非局部返回"（直接退出外层函数），但在特殊场景（如多线程）中会有风险，crossinline 可禁止这种行为：

```kotlin
inline fun runInThread(crossinline action: () -> Unit) {
    Thread {
        action()  // 若 action 无 crossinline，此处不允许调用
    }.start()
}

fun main() {
    runInThread {
        println("Running in thread")
        // 不能直接 return（被 crossinline 禁止）
    }
}
```

## 五、使用场景

1. **带 lambda 的小型高阶函数**

如工具类函数（forEach、with 等），频繁调用时能显著减少性能损耗。

1. **需要频繁调用的函数**

如日志函数、校验函数等，内联可省去函数调用的跳转开销。

1. **需要 lambda 支持非局部返回时**

如校验逻辑，希望不通过时直接退出外层函数：

```kotlin
inline fun check(condition: Boolean, error: () -> Unit) {
    if (!condition) error()
}

fun doSomething() {
    check(用户已登录) { 
        println("请先登录")
        return  // 直接退出 doSomething()（非局部返回）
    }
    // 后续逻辑...
}
```

## 六、注意事项

1. **避免对大型函数使用**

会导致编译后的字节码体积膨胀（代码重复插入）。

1. **inline** **仅能修饰函数**

不能用于类、属性、接口等。

1. **可见性限制**

例如 private 内联函数无法在其他模块中被内联调用。

1. **不要滥用**

非高阶函数或很少被调用的函数，加 inline 意义不大。

## 七、总结

inline 是 Kotlin 针对高阶函数的性能优化工具，通过编译期代码内联：

- 减少函数调用开销

- 避免 lambda 产生的匿名类对象

- 支持灵活的返回控制

核心原则：**小而频繁的高阶函数优先考虑使用** **inline**。
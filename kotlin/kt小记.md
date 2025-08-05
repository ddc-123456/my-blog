# with

在 Kotlin 中，`with` 是一个标准库函数，它的主要作用是**简化对同一对象的多次操作**，通过为对象创建一个临时作用域，让你可以直接访问该对象的属性和方法，而无需重复写出对象名。

```kotlin
data class Person(var name: String, var age: Int)

fun main() {
    val person = Person("Alice", 25)
    
    // 不使用 with 的写法
    person.name = "Bob"
    person.age = 30
    println("${person.name}, ${person.age}")
    
    // 使用 with 的写法
    with(person) {
        name = "Charlie"  // 直接访问属性，无需写 person.
        age = 35          // 直接访问属性
        println("$name, $age")  // 直接访问
    }
}
```

# 获取设备屏幕密度信息

```kotlin
val statusBarHeightDp = with(LocalDensity.current) {
	statusBarHeight.toDp() // 将 16dp 转换为实际像素值
}
```

# Accompanist

Accompanist 是一组库，旨在为 [Jetpack Compose](https://developer.android.com/jetpack/compose) 补充开发人员通常需要但尚未提供的功能。

#  private set

在 Kotlin 中，`private set` 这种写法是**针对属性的 setter 方法单独设置访问权限**，这是 Kotlin 语法的特殊设计，允许你对属性的 “读” 和 “写” 权限做区分。

```kotlin
class User {
    // 读权限：默认 public（外部可以读）
    // 写权限：被限制为 private（只有类内部可以改）
    var nickname = "游客"
        private set

    fun changeNickname(newName: String) {
        // 类内部可以调用 setter（因为是 private set）
        nickname = newName
    }
}

fun main() {
    val user = User()
    // 读操作：允许（因为 getter 是 public）
    println(user.nickname) // 输出：游客

    // 写操作：不允许（因为 setter 是 private）
    // user.nickname = "新名字" // 编译报错！

    // 只能通过类内部的方法间接修改
    user.changeNickname("小明")
    println(user.nickname) // 输出：小明
}
```


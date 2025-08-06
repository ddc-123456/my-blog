# 我的实际成功做法

1. 把moduld的文件夹放在与app同级

2. NEW -> Import module 选择刚刚的文件夹

3. settings.gradle.kts 里面加上include (":picture-editor") 一般用Import module会帮你自动写上

   1. ```kotlin
      Import moduleinclude(":app")
      include (":picture-editor")
      include(":CNDatePicker")
      project(":CNDatePicker").projectDir = File(rootDir, "DatePicker/")
      ```

4. 在app级的build.gradle.kts加上 

   1. ```kotlin
      implementation(project(":picture-editor"))
      implementation(project(":CNDatePicker"))
      ```
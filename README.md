全局：

在哪里打开终端都可以，新打开的项目先执行install重新安装依赖然后选择Y，再执行npm update -g pnpm
```sh
pnpm install
npm update -g pnpm
```sh

列出npm全局安装的包
```sh
npm ls -g
```

列出全局包中过期的
```sh
npm outdated -g
```

更新pnpm
```sh
npm update -g pnpm
```

项目：

在项目文件夹打开终端

更新所有包（不一定全部升级完）
```sh
pnpm update
```

查看哪些包是过期的
```sh
pnpm outdated
```

放心升级：1.2.3 -> 1.2.4

基本也都能升级：1.2.0 -> 1.3.0

谨慎升级：1.0.0 -> 2.0.0

手动去升级，xxx改为包名
```sh
pnpm update xxx@latest
```

项目启动：

```sh
pnpm dev
```

项目打包：
dist文件夹压缩成zip
```sh
pnpm build
```
创建项目
```sh
pnpm create vue@latest
```
<!-- 外部py库（EIS）
```sh
python setup.py install 
```
```sh
pip install PyEIS==1.0.10
``` -->

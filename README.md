# upload

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


[资料1](https://segmentfault.com/a/1190000019823978?utm_source=tag-newest)
[webuploader](http://fex.baidu.com/webuploader/getting-started.html)


### 登录成功
```json
{
    "resultCode":"0000",
    "message":"请求成功！",
    "success":true,
    "data":{
        "deptName":"测试分公司",
        "token":"1488plvyhqtqk1r94mcrnr7d95",
        "user":{
            "id":"15777287229",
            "name":"姜海宁",
            "password":"",
            "parentId":"123456789",
            "managerCode":2
        }
    },
    "total":0
}
```
### 登录失败
```json
{
    "resultCode":"0001",
    "message":"用户名和密码不匹配",
    "success":false,
    "data":null,
    "total":0
}
```
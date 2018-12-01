# plug-in
小功能插件

使用插件先在页面中引入Plug-cc.js和Plug-cc.css这2个文件

内容1：表单的存值与取值

存值:调用formData.set（data,formSelector）方法  
其中 formSelector 为选好的表单元素  
data 数据格式为{name:value}  
name为要填入的输入元素的name的值  
value为对应元素想要填入的内容  

取值:调用formData.get（formSelector）方法  
其中 formSelector 为选好的表单元素  
方法返回的数据格式为{name:value}  
其中，name为要输入元素的name的值  
value为对应元素的值  

内容2：弹出消息或提示

第一种：调用addPopup.global（）方法

需要弹出提示的元素加上data-popout属性，其值为弹出的内容  
元素的data-position属性可以设置弹出的位置，参数可以为：  
top:向上移动一个弹出框（高度）的距离  
bottom:向下移动一个弹出框（高度）的距离  
left:向左移动一个弹出框（高度）的距离  
right:向右移动一个弹出框（高度）的距离  

第二种：调用addPopup.part（triggerSelector, popupSelector,location）方法

其中triggerSelector为点击触发弹出消息的元素  
popupSelector为选好的要弹出的元素  
location数据内容为{position：，xOffset：，yOffset:  }  
xOffset,yOffset分别为弹出消息的X轴与Y周偏移量  
往上移yOffset加负值，往左移xOffset同理  
position默认居中center，可选：mid-top（中上）、mid-bottom（中下）  
left-top（左上）、left-mid（左中）、left-bottom（左下）  
right-top（右上）、right-mid（右中）、right-bottom（右下）  
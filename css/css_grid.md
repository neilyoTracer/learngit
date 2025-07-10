# 概述
Grid 布局与 Flex 布局有一定的相似性，都可以指定容器内部多个项目的位置。但是，它们也存在重大区别。

**Flex 布局**是轴线布局，只能指定"项目"针对轴线的位置，可以看作是**一维布局**。**Grid 布局**则是将容器划分成"行"和"列"，产生单元格，然后指定"项目所在"的单元格，可以看作是**二维布局**。Grid 布局远比 Flex 布局强大。

# 基本概念
## 容器和项目
容器 : container
子项 : item
* 注意：项目只能是容器的顶层子元素，不包含项目的子元素，比如上面代码的<p>元素就不是项目。Grid 布局只对项目生效。

## 行和列
容器里面的水平区域称为"行"（row），垂直区域称为"列"（column）。

## 单元格
行和列的交叉区域，称为"单元格"（cell）。

正常情况下，n行和m列会产生n x m个单元格。比如，3行3列会产生9个单元格。

## 网格线
grid line

# 容器属性
Grid 布局的属性分成两类。一类定义在容器上面，称为容器属性；另一类定义在项目上面，称为项目属性。这部分先介绍容器属性。

## display 属性
display: grid 指定一个容器采用网格布局
div {
    display: grid
}

默认情况下，容器元素都是块级元素，但也可以设成行内元素。
div {
    display: inline-grid
}

上面代码指定div是一个行内元素，该元素内部采用网格布局。
！！注意，设为网格布局以后，容器子元素（项目）的float、display: inline-block、display: table-cell、vertical-align和column-*等设置都将失效。

## grid-template-columns， grid-template-rows属性
.container {
    display: grid;
    grid-template-columns: 100px 100px 100px;
    grid-template-rows: 100px 100px 100px;
}

除了使用绝对单位，也可以使用百分比。

.container {
  display: grid;
  grid-template-columns: 33.33% 33.33% 33.33%;
  grid-template-rows: 33.33% 33.33% 33.33%;
}

有时候，重复写同样的值非常麻烦，尤其网格很多时。这时，可以使用repeat()函数，简化重复的值。上面的代码用repeat()改写如下。
.container {
    display: grid;
    grid-template-columns: repeat(3, 33.33%);
    grid-template-rows: repeat(3, 33.33%);
}

repeat()重复某种模式也是可以的。
grid-template-columns: repeat(2, 100px 20px 80px);
=> 
grid-template-columns: 100px 20px 80px 100px 20px 80px;

auto-fill关键字
.contianer {
    display: grid;
    grid-template-columns: repeat(auto-fill, 100px);
}

fr 关键字
为了方便表示比例关系，网格布局提供了fr关键字（fraction 的缩写，意为"片段"）。如果两列的宽度分别为1fr和2fr，就表示后者是前者的两倍。
.container {
    display: grid;
    grid-template-columns: 1fr 1fr;
}

fr可以与绝对长度的单位结合使用，这时会非常方便。
.container {
    display: grid;
    grid-template-columns: 150px 1fr 2fr
}

minmax()
minmax()函数产生一个长度范围，表示长度就在这个范围之中。它接受两个参数，分别为最小值和最大值。
grid-template-columns: 1fr 1fr minmax(100px, 1fr);

auto
grid-template-columns: 100px auto 100px;

## grid-row-gap/row-gap, grid-column-gap/column-gap, grid-gap/gap 
.container { 
    grid-row-gap: 20px;
    grid-column-gap : 20px;
}

grid-gap属性是grid-column-gap和grid-row-gap的合并简写形式，语法如下。

grid-gap: <grid-row-gap> <grid-column-gap>;
.container { 
    grid-gap: 20px 20px;
}
根据最新标准，上面三个属性名的grid-前缀已经删除，grid-column-gap和grid-row-gap写成column-gap和row-gap，grid-gap写成gap。

## grid-template-areas
.container {
  display: grid;
  grid-template-columns: 100px 100px 100px;
  grid-template-rows: 100px 100px 100px;
  grid-template-areas: 'a b c'
                       'd e f'
                       'g h i';
}

直接给区域命名

## grid-auto-flow
划分网格以后，容器的子元素会按照顺序，自动放置在每一个网格。默认的放置顺序是"先行后列"，即先填满第一行，再开始放入第二行，即下图数字
的顺序。
这个顺序由grid-auto-flow属性决定，默认值是row，即"先行后列"。也可以将它设成column，变成"先列后行"。

grid-auto-flow: column

grid-auto-flow属性除了设置成row和column，还可以设成row dense和column dense。这两个值主要用于，某些项目指定位置以后，剩下的项目怎么自动放置。

上图中，1号项目后面的位置是空的，这是因为3号项目默认跟着2号项目，所以会排在2号项目后面。

现在修改设置，设为row dense，表示"先行后列"，并且尽可能紧密填满，尽量不出现空格。



上图会先填满第一行，再填满第二行，所以3号项目就会紧跟在1号项目的后面。8号项目和9号项目就会排到第四行。

如果将设置改为column dense，表示"先列后行"，并且尽量填满空格。
grid-auto-flow: column dense;

## justify-items, align-items, place-items
.container {
  justify-items: start | end | center | stretch;
  align-items: start | end | center | stretch;
}
place-items: <align-items> <justify-items>;

## justify-content, align-content, place-content

.container {
  justify-content: start | end | center | stretch | space-around | space-between | space-evenly;
  align-content: start | end | center | stretch | space-around | space-between | space-evenly;  
}
start - 对齐容器的起始边框。
end - 对齐容器的结束边框。
center - 容器内部居中。
stretch - 项目大小没有指定时，拉伸占据整个网格容器。
space-around - 每个项目两侧的间隔相等。所以，项目之间的间隔比项目与容器边框的间隔大一倍。
space-between - 项目与项目的间隔相等，项目与容器边框之间没有间隔。
space-evenly - 项目与项目的间隔相等，项目与容器边框之间也是同样长度的间隔。

place-content: <align-content> <justify-content>

place-content: space-around space-evenly;

## grid-auto-columns, grid-auto-rows

# 项目属性
## grid-column-start, grid-column-end, grid-row-start, grid-row-end
项目的位置是可以指定的，具体方法就是指定项目的四个边框，分别定位在哪根网格线。

grid-column-start属性：左边框所在的垂直网格线
grid-column-end属性：右边框所在的垂直网格线
grid-row-start属性：上边框所在的水平网格线
grid-row-end属性：下边框所在的水平网格线


.item-1 {
  grid-column-start: 2;
  grid-column-end: 4;
}

.item-1 {
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 2;
  grid-row-end: 4;
}

这四个属性的值，除了指定为第几个网格线，还可以指定为网格线的名字。


.item-1 {
  grid-column-start: header-start;
  grid-column-end: header-end;
}

这四个属性的值还可以使用span关键字，表示"跨越"，即左右边框（上下边框）之间跨越多少个网格。

.item-1 {
  grid-column-start: span 2;
}
上面代码表示，1号项目的左边框距离右边框跨越2个网格。
这与下面的代码效果完全一样
.item-1 {
  grid-column-end: span 2;
}

使用这四个属性，如果产生了项目的重叠，则使用z-index属性指定项目的重叠顺序。

## grid-column, grid-row

.item {
  grid-column: <start-line> / <end-line>;
  grid-row: <start-line> / <end-line>;
}


.item-1 {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
}
/* 等同于 */
.item-1 {
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 2;
}

.item-1 {
  background: #b03532;
  grid-column: 1 / 3;
  grid-row: 1 / 3;
}
/* 等同于 */
.item-1 {
  background: #b03532;
  grid-column: 1 / span 2;
  grid-row: 1 / span 2;
}

## grid-area
grid-area属性指定项目放在哪一个区域。

.item-1 { 
    grid-area: e;
}
grid-area属性还可用作grid-row-start、grid-column-start、grid-row-end、grid-column-end的合并简写形式，直接指定项目的位置。
.item {
  grid-area: <row-start> / <column-start> / <row-end> / <column-end>;
}
.item-1 {
  grid-area: 1 / 1 / 3 / 3;
}

## justify-self, align-self, place-self
justify-self属性设置单元格内容的水平位置（左中右），跟justify-items属性的用法完全一致，但只作用于单个项目。

align-self属性设置单元格内容的垂直位置（上中下），跟align-items属性的用法完全一致，也是只作用于单个项目。

.item {
  justify-self: start | end | center | stretch;
  align-self: start | end | center | stretch;
}

start：对齐单元格的起始边缘。
end：对齐单元格的结束边缘。
center：单元格内部居中。
stretch：拉伸，占满单元格的整个宽度（默认值）。

place-self: <align-self> <justify-self>;
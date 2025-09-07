/*
part 1:
document.write("heello") للطباعة
console.log("hello")
documnet.write( typeof 10 ) لمعرفة نوع التغير
المتغيرات
1- var name = 'ahemd'; declration مو لازم تحدد النوع
2- let x = 20;
var and let are mostly same
3- const v = 30; متغير ثابت

الدمج في javascript
1- let name = "ahmed";
   let age = 26 ; 
   conslole.log(name + age)
   الدمج يكون بالزايد فقط
2- console.log(`my name is $(name) and may age is $(age)`)   
_____________________
part 2: 
تحويل النصوص الى ارقام
console.long('5' - '4') // 1 في الزايد لا الباقي عادي
console.log(  +'5'      +     +'7'      ) // 12 فائدة الزايد التحويل الى رقم لو حطيت سالب راح يكون سالب
console.log(Number('4'))
console.log(parseInt('4 ahmed')) // 4 لو حطيت احمد في البداية ما راح يشتغل او رقم عشري
console.log(parseFloat('4.5')) // 4.5
Number is object يعني فيه عمليات حط نقطه
console.log(Numbar.isInterger(4)) // true
console.log(Numbar.isInterger(4)) // true
console.log(Numbar.NaN(4)) // true

MATH object:
uppercase => الخصائص
lowercase => الفنكشن
console.log(Math.abs(-4)) // 4
console.log(Math.sqrt(4)) // 2
console.log(Math.pow(2,3)) // 8
console.log(Math.round(10.5)) // 11 اقرب عدد صحيح
console.log(Math.ceil(10.1)) // 11
console.log(Math.floor(10.9)) // 10
console.log(Math.min(-4 , 2 ,1)) // -4
console.log(Math.max(-4 , 2 ,1)) // 2

let zakah = window.prompt(); لاخذ قيمة من المستخدم
console.log(0.025 * 1000) ; // 25

part 3:
تحويل الارقام الى نصوص
let x = 100;
1 - console.log( string(10))
2 - console.log(x.toString())
3 - console.log((100).toString())
4 - console.log(100..toString())

STRING 
let name = 'ali'
console.log(name.repeat(3))
console.log(name.length) // 3
console.log(name[0]) // a
console.log(name.charAt(0)) // a
console.log(name.indexOf('l')) // 1 رقم الاندكس
console.log(name.indexOf('l' , اذا حطيت رقم مكان البحث يبدأ من وسن)) // 1 رقم الاندكس
console.log(name.indexOf('ali')) // 0 رقم الاندكس
console.log(name.lastIndexOf('ali')) // للبحث من النهاية
console.log(name.slice(strart , end)) // // لتقطيع الجملة هنا تقدر تحط سالب 
console.log(name.split()) //  لتقطيع الجملة و وضعها في ارراي وتقدر تحط مكان التقطيع

console.log(name.substring(start , end)) // 
console.log(name.substr(start , length)) // لتقطيع الجملة

البحث في النصوص
let name = "i love java script";
console.log(name.includes('a')) // true or false now is true
console.log(name.includes('a' , start)) // true or false now is true
console.log(name.startWith('i)) // true تبدا 
console.log(name.startWith('i' , start )) //
console.log(name.endtWith('t')) // true 
console.log(name.endtWith('t' , length)) // true 

part 4:
ARRAY

DataType : [ARRAY]
let names = ['ahmed' , 'ali' , 'khald'];
cosole.log(names); // ['ahmed' , 'ali' , 'khald'];
تقدر تسوي نستد ارراي 
let names = ['ahmed' , 'ali' , 'khald' , [1 , 2 ,3]];
console.log(names[3][0]) // 1

اضافة عنصر في الاراي
let names = ['ahmed' , 'ali' , 'khald'];
names.push( "ibrahim" , "yasir") بيضيفهم من النهاية
names.unshift( "ibrahim" , "yasir") بيضيفهم من البداية

الازالة

names.shift() للحذف من البداية لكن تحتفظ فيه
names.pop() للحذف من النهاية لكن تحتفظ فيه

إزالة عنصر محدد

names.splice(مكان الي تبغا تحذفه , number of element to delete );
names.splice(مكان الي تبغا تحذفه , number of element to delete  , تقدر تضيف اشياء);
splice(start , count , add , add); هذي تأثر على الاراي
slice(start , end) ; لا تأثر

البحث في الاراي

names.indexOf('ahmed') // num of index
names.lastIndexOf('ahmed') // num of index من النهاية
names.includes('ahmed') // true or false

الترتيب
names.reverse();
names.sort();

الدمج في الاراي
arr1 = arr1 + arr2 // راح يطبع لكن راح يكون سترينج
arr1.concat(arr2 , تقدر تحط زيادة او نص)
في حال تبغى تعرض الاراي بدون الاقواس
arr1.join(هنا تقدر تحط نوع مثلا - بدال الفاصلة);
____________________
part 5:
المقارنات
x.toUpperCase();
x.toLowerCase();
x.trim() ; لإزالة المسافات من البداية و النهاية فقط

5 == '5' ; // true للمقارنة بين المتغيرات فقط ماله شغل بالنوع
5 === '5' ; // false للمقارنة بين المتغيرات و نوع البيانات   

IF
if(condition){
}
else if(){
}
else{
}
الاختصار
age >= 18?document.write('if') :age == 18?document.write('else if ') :document.write('else')

SWITCH

switch(){
   case 1:
   break;
   case 2:
   break;
   default:
}
___________________________
part 6:
LOOP
for( let i = 0 ; i < 3 ;i++ ){
}

while(){
}

do{
}while();
__________________________
part 7:
function name() // function declration
{

return
}

let hello = function(){ // function expression

}

طريقة استدعاء الدالة بدون اسم
( function ()
   any thinkg
)();
  |
هذا يدل على الاستدعاء الذاتي

القيم الافتراضية
function name(x = 'person'){

return
}

في حال مو عارف عدد البرماتير تقدر تسوي ارراي
functon calc( ...name-of-array){

}
calc(43,34,6,7,4,3,9,3,6,7,9) // في حال الطباعة راح يطبعهم ك ارراي

ARROW FUN
let x = () => {
   return 1;
}
_____________________
part 8:
Object Javascript
let car = { title : "BMW" , price : 500 , hello:functoin{ return 1;} ....}; بدون ما نكتب النوع
console.log(car.title); // BMW
ممكن يكون nested object

create object 
let user = {}; نفترض ان اوبجكت فاضيه نقدر نضيف لها
user.name = "ahmed";

'THIS' KEYWORD
   => تنتمي الى object حيث تقدر تكتبها بدال user

"use strict" فائدته انك تقدر تكتبه عشان لو عدك اخطاء تقدر تعدلها ام لو بدون الجافا راح تمشي

طريقة ثانية لانشاء اوبجكت

let name2 = Object.create(name); هذي اذا عندك اوبجت قديمة تدر تربطها مع الجديدة
Object.create(object , {property
   age: {value:20}
})

دمج الاوبجكت
let a1 = {
num1 :1
}
let a2 = {
num2 :2
}
let a3 = {
num3 :3
}

let a4 = Object.assign(a1 ,a2 , a3 , {تقدر تضيف اوبجكت})
_____________________________
part 9 :
selcet elments by javascript
اذا تبغا توصل لعناصر html تكتب document
document.getElementById('head') ; باستخدام id
id يكون فريد يعني ما تكرر
class تقدر تكرر نفس الاسم عادي و تستخدمه
document.getElementsByClassName('head'); هنا راح يستعرض كل العناصر لانك كاتب و تعتبر كانها ارراي
document.getElementsByClassName('head')[0];

Tagname نفس شي مثل h1 h2 h3...
document.getElementsByTagName('h1')[0];

document.querySelector('.اسم الكلاس') ; هذي اريح للاستخدام 
document.querySelector('#اي دي') ; هذي اريح للاستخدام 
بس في مشكلة انه راح يجيب اول عنصر
حل المشكلة
document.querySelectorAll('.اسم الكلاس') ; و ترجعهم كانهم ارراي

اذا تبغا توصل للبودي 
let body = doucment.body;
body.style.backgournd = 'red';

let title = doucment.title;
let images = document.images[]; و تتعامل كانها ارراي
let links = doucment.links[];
let form = doucment.forms[];

in html
<element attribute> text </element> هذا توضيح لي الاتربيوت
اضافة و تعديل attribute

img.hasAttributes() // true or false للتأكد اذا فيه او لا
img.hasAttribute('src') // هنا تحدد الاتربيوت و يعطيك tru or false

img.attributes ; هنا راح يطلع كل الاتربيوت و تقدر توصل الي تبغا برقم الاندكس
img.attributes[1] ; هنا راح يطلع كل الاتربيوت و تقدر توصل الي تبغا برقم الاندكس

img.setAttributes('alt' , 'ahmed') ; للتعديل عليه

للحذف
img.removeAttribute('alt');

INNER AND OUTER
let contaier = document.getElementById('container');
console.log(containter.outerHTML) ; هذا راح يعرض كل الكود الي كتبته
console.log(containter.innerHTML) ; هذا راح يعرض محتوى الكود الي كتبته

تقدر تعدل
container.outerHTML= '<p>hello</p> '; راح يشيل كل شي و يحط ذا بداله
container.innerHTML= '<p>hello</p>' ; راح يشيل الي داخل فقط و يحط ذا بداله
container.innerText = '<p>hello</p>'; هذا راح يضيفه كنص
container.outerText = '<p>hello</p>';

SIBLING AND PARENT
let elemnt = document.getElementById('second') ; 
console.log(element.previousElementSibling) ; // راح يجيب العنصر الي قبله
console.log(element.nextElementSibling) ; 

هنا راح يجيب الي قبله سواء كان عنصر او اي شي ثاني
console.log(element.nextSibling)      ; 
console.log(element.pervioustSibling) ; 

console.log(element.parentElement) // يجيب الاب

التعديل على سي اس اس بالجافاسكربت

// element.style.property = value
                  -> الخصائص نفس الموجودة بس ما تكتب - تخلي كبتل

// element.style.cssText = '
   background:red
'
للحذف
element.style.removeProperty('color');
لاضافة
element.style.setProperty('color' , 'red');

=-=--=-=-=-
انشاء عناصر باستخدام جافاسكربت
// انشاء العنصر
let containter = document.createElement('div');
let head = document.createElement('h1');
let img = document.createElement('img');

// اضافة محتوى
let content = document.createTextNode('hello world);
head.appendChild(content);
img.src = '';

// اضافة العنصر في المكان المراد
contanier.appendChild(head);
contanier.appendChild(img);
doucment.body.appendChild(container);



EVENTS
الطريقة الاولى
let btn;
btn.onclick = سوي الي تبغا
الطريقة الثانية
btn.addEventListener('click' , function(){
document.body.style.background = 'red';
})

btn.onmouseup
btn.onmousedown
btn.onmouseover
btn.onmouseout
btn.onmousemove
btn.oncontextmenu
hello.classList.toogle();
---------
keyborad
inp.onkeyup
inp.onkeydown
inp.onfocus
inp.onblur
----------
window
onloud
----------
btn.after();
btn.before();
btn.append();
`--------------
btn.classList.add/remove... فائدته انك تضيف له كلاس

______________________
part 10:
BOM
التحكم في scroll
window.scroll(50  x, 200 y)
window.scrollBy(x,y) تزيد على المكان
scrollY تعطي احداثيات
scrollX تعطي احداثيات

window.onscroll
behavior : 'smooth'

معرفة ابعاد الشاشة و دقتها
screen.height;
screen.width; 
screen.availWidth; avialbe widht
screen.availHeight; avialbe height
screen.orientation.type ; نوع الشاشة عرض او طول

location Object
https://www.instagram.com/abdelrahman_noufal/ == href
https: == protocol
www.instagram.com == host name
/abdelrahman_noufal/ == path name

location.href

location.reload();

locatioin.assign('wwww') // راح يوديك لرابط مع امكانية الرجوع
location.replace('ww') // بدون امكانية رجوع

setTimeOut & setInterval
let hello = setTimeout(function(){} , 3000 == 3s) هذا يساويها لمره واحدة فقط
clearTimeout(hello) ; هذا راح يوقفه

let hello = setInterval(function(){} , 1000 = 1s) ; هذا راح يكرر كل ثانية
clearInterval(hello)

حفظ البيانات بشكل دائم في المتصفح
local بتحفظ البيانات بشكل دائم
localStorage.setItem('name', 'ali') // لاضافة بيانات
==
localStorage.name = "ali";

لقراءة البيانات
console.log(localStorage.getItem('name'))
==
console.log(localStorage.name)
راح يسجل البيانات على انها سترينج
حلها
localStorage.setItem('age', JSON.stringify(25)) 
console.log(JSON.parse(localStorage.getItem('age'))) // راح يرجعه لاصله

console.log(localStorge.key(0 ...)) // هنا توصل لكل البيانات تحط الي تبغا

لحذف البيانات
localStorage.removeItem('name'); لحذف بيانات معينة
localStorage.clear() ; لحذف كل البيانات


session مجرد ما يقفل الصفحة خلاص
________________________
part 11:
CRUD

*/


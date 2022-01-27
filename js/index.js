// import {$} from "./utils/dom.js";
// import store from "./store/store.js";

const $ = (selector) => document.querySelector(selector);

const store = {
    setLocalStorage(todo) {
        localStorage.setItem("todo", JSON.stringify(todo));  //문자열로만 드갈 수 있도록 json.stringify 처리
    },
    getLocalStorage(){
        return JSON.parse(localStorage.getItem("todo"));  // 문자열로 가져온 item값들을 다시 json객체로 파싱
    },
};


function App(){
    
    // Storage에 들어갈 배열 생성
    this.todo ={
        year:[],
        month:[],
        weekend:[],
        day:[],
    }; 

    this.currentCategory ='day'; //이 문자열을 변수에 넣고 this.todo의 키로 활용할 것.

    this.init = () => {   //초기화하는 부분
        if (store.getLocalStorage()){
            this.todo = store.getLocalStorage();
        }
        render();
        initEventListeners();  //event listner들 초기화하는 부분에 넣어둔 것
    }

    const render = () => {        //localstorage에 있는 값들을 저장해서 템플릿을 그려주는 함수
        const template = this.todo[this.currentCategory].map((item,index) => {     // 템플릿 데이터 순회
            return `
            <li data-todo-id="${index}" id="li"> 
                <span class="todo ${item.complete ? "todo-complete" : ""}">${item.name}</span>
                <div class="li_button">
                    <p class="update">수정</p>
                    <p class="delete">삭제</p>
                    <p class="complete">완료</p>
                </div>
            </li>`
            //위에 ${item.complete ? "todo-complete" : ""}   -> 완료 눌렀을 때 밑에 함수에서 true를 넣어줬으므로 true면 todo-complete 클래스 추가, undefined면 추가 안함("")
        }).join("");  // <li>~</li><li>~</li> 이렇게 저장된 형식을 풀어줌


        $("#todoList").innerHTML = template;     
        updateTodoCount();
    }

    // 할일의 개수
    const updateTodoCount = () =>{
        const todoCount = this.todo[this.currentCategory].length;
        $(".sub_count").innerText = `총 ${todoCount}개`;
    };

    // 엔터키를 누른 후에 밑에 리스트 추가되고, 카운트 증가하는 로직
    const addTodoList = () => {
        if($(".form_input").value ===""){
            alert("값을 입력해주세요");
            return;
        }

            const todoName = $(".form_input").value;
            this.todo[this.currentCategory].push({ name: todoName }); // storage todo에 들어갈 todoName
            store.setLocalStorage(this.todo);  // 데이터가 바뀔때마다 sotrage 상태 저장
            render();
            $(".form_input").value="";
    };

    // todo 수정하는 함수
    const updateTodo = (e) => {
        const todoId = e.target.closest("li").dataset.todoId;  // 템플릿에 todoId넣은 값 todoId에 대입
        const $todoName = e.target.closest("li").querySelector(".todo");  //.update(수정버튼)과 가장 가까운 li태그 중 .todo값을 저장
        const updatedTodo = prompt("할일을 수정하세요",$todoName.innerText); // 새롭게 바꾼 값을 updatedTodo에 대입
        this.todo[this.currentCategory][todoId].name = updatedTodo; // storage todo배열 name에 새롭게 바뀐값 대입
        store.setLocalStorage(this.todo);  // storage 업뎃
        // $todoName.innerText = updatedTodo;  기존의 todo의 text값을 updatedTodo로 바꾼다. (후에 render를 정의했으니 render 사용)
        render();
    }

    // todo 삭제하는 함수
    const deleteTodo = (e) => {
        if(confirm("정말 삭제하시겠습니까?")){
            const todoId = e.target.closest("li").dataset.todoId;
            this.todo[this.currentCategory].splice(todoId,1);
            store.setLocalStorage(this.todo)
            // e.target.closest("li").remove();  이렇게 지워도 되지만 render()를 정의했으므로 render를 쓰자
            render();  
        };
    }

    // todo 완료하는 함수
    const completeTodo = (e) => {
        const todoId = e.target.closest("li").dataset.todoId;
        this.todo[this.currentCategory][todoId].complete =! this.todo[this.currentCategory][todoId].complete; // .complete는 그냥 템플릿의 span태그에 상태값 주기 위한 변수. 토글형태
        store.setLocalStorage(this.todo);
        render();
    }

    const initEventListeners = () => {             //eventlistener들을 모아서 관리.
    // 할일text 수정, 할일 list 삭제, 완료
    $('#todoList').addEventListener("click", (e) => {
        if(e.target.classList.contains("update")){
            updateTodo(e);
            return;
        };

        if(e.target.classList.contains("delete")){
            deleteTodo(e);
            return;
        }

        if(e.target.classList.contains("complete")){
            completeTodo(e);
            return;
        }
    });

    // enter키를 쳤을 때 자동으로 새로고침(전송하는 것)을 방지 (form태그의 특성)
    $('.form').addEventListener("submit",(e) => {
        e.preventDefault(); 
    });


    // 입력버튼을 클릭했을 때 addTodoList가 동작
    $(".form_btn").addEventListener("click", addTodoList);


    // input창에 todolist를 입력하고 (혹은 공백) enter누르는 순간에 addTodoList return
    $(".form_input").addEventListener("keydown", (e) =>{
        if (e.key === "Enter"){
            return;
        }
        addTodoList();
    });

    $("nav").addEventListener("click", (e)=>{
        const isCategoryButton = e.target.classList.contains("nav-category")
        if(isCategoryButton){  // 클릭한 부분의 클래스가 nav-category를 포함한다면(바로 윗줄)
            const categoryName = e.target.dataset.categoryName 
            this.currentCategory = categoryName;  // 클릭한 것의 data속성값으로 currentCategory값 변경
            $("#category-title").innerText = `${e.target.innerText} 내가 해야할 일`; //클릭한 nav 값으로 텍스트 변경    
            render(); // render함수도 this.todo[this.currentCategory]처리 해줬기 때문에 다시 실행
        }
    })        
    }


}


const app = new App();
app.init();

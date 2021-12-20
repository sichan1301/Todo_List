const store = {
    setLocalStorage(todo) {
        localStorage.setItem("todo", JSON.stringify(todo));  //문자열로만 드갈 수 있도록 json.stringify 처리
    },
    getLocalStorage(){
        return JSON.parse(localStorage.getItem("todo"));  // 문자열로 가져온 item값들을 다시 json객체로 파싱
    },
};

export default store;
function handleInputChange(input) {
    const btns = document.getElementsByClassName("exbtnid")
    for (let i = 0; i < btns.length; i++) {
        var btn = btns[i]
        if (input === "") {
            btn.style.display = "inline"
        } else {
            console.log(btn.dataset.search, input)
            if (btn.dataset.search.toLowerCase().startsWith(input.toLowerCase())) {
                btn.style.display = "inline"
            } else {
                btn.style.display = "none"
            }
        }
    }
}
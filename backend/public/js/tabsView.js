$(document).ready(function(){
    var tabsNum = 9;
    var tabsView1 = [];
    var currentTab = 0;
    for(var i=0; i<tabsNum; i++){
        tabsView1.push({
            id: i,
            btn: $(`#districts-tab-link${i}`),
            view: $(`#districts-tab-view${i}`),
        })
    }
    var hideTabs = () => {
        for (let i = 0; i < tabsView1.length; i++) {
            tabsView1[i].btn.removeClass('active');
            tabsView1[i].view.hide();
        }
    }
    tabsView1[currentTab].view.show();
    tabsView1.forEach(tab => {
        tab.btn.click(() => {
            hideTabs();
            tab.btn.addClass('active');
            tab.view.fadeIn(400);
        })
    })
});
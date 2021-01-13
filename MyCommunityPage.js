const dataPanel = document.querySelector("#data-panel")
const paginator = document.querySelector(".pagination")
const addBtn = document.querySelector('.btn-info')
const input = document.querySelector('#input-keywords')
const searchBtn = document.querySelector('#search-btn')
const panelSwitch = document.querySelector('#panel-switch')
const regionMenu = document.querySelector('#region-dropdown')
const ageMenu = document.querySelector('#age-dropdown')
const genderMenu = document.querySelector('#gender-dropdown')
const BASE_URL = "https://lighthouse-user-api.herokuapp.com/"
const INDEX_URL = BASE_URL + "api/v1/users/";

axios
  .get(INDEX_URL)
  .then((response) => {
    // handle success
    modal.userList.push(...response.data.results);
    view.renderUserList(modal.getUsersByPage(1));
    view.createPages(modal.userList)
    view.setPageDefault()
    view.renderRegionMenu(modal.userList)
    view.renderAgeMenu()
    view.renderGenderMenu(modal.userList)
  })
  .catch((error) => {
    // handle error
    console.log(error);
  })

// View
const view = {
  setPageDefault() {
    modal.currentDisplay === 'card' ?
      this.renderUserList(modal.getUsersByPage(1)) : this.switchToList(modal.getUsersByPage(1))
    const dataList = (modal.filterUserList.length) ? modal.filterUserList : modal.userList
    this.createPages(dataList)
    modal.currentPageNum = 1
    modal.currentTotalPages = paginator.children.length - 2
    modal.currentPage = document.querySelector('.numeric-page')
    this.turnActivePage(modal.currentPage)
    this.toggleNextPage(modal.currentPageNum, modal.currentTotalPages)
    this.togglePreviousPage(modal.currentPageNum)
  },

  createPages(dataList) {
    const totalPages = Math.ceil(dataList.length / modal.USERS_PER_PAGE);
    paginator.innerHTML = `
        <li class="page-item disabled">
          <a class="page-link previous-page text-monospace font-weight-bold" href="#" tabindex="-1" aria-disabled="true">Previous</a>
        </li>
    `;
    for (page = 1; page <= totalPages; page++) {
      paginator.innerHTML += `
        <li class="page-item">
          <a class="page-link numeric-page text-monospace font-weight-bold" href="#" data-id="${page}">${page}</a>
        </li>
      `;
    }
    paginator.innerHTML += `
        <li class="page-item">
          <a class="page-link next-page text-monospace font-weight-bold" href="#">Next</a>
        </li>
    `;
  },
  
  toggleNextPage(currentPageNum, currentTotalPages) {
    const nextPage = document.querySelector('.next-page').parentElement
    if (currentPageNum === currentTotalPages && !nextPage.classList.contains('disabled')) {
      nextPage.classList.toggle('disabled')
    } else if (currentPageNum !== currentTotalPages && nextPage.classList.contains('disabled')) {
      nextPage.classList.toggle('disabled')
    }
  },

  togglePreviousPage(currentPageNum) {
    const perviousPage = document.querySelector('.previous-page').parentElement
    if (currentPageNum === 1 && !perviousPage.classList.contains('disabled')) {
      perviousPage.classList.toggle('disabled')
    } else if (currentPageNum !== 1 && perviousPage.classList.contains('disabled')) {
      perviousPage.classList.toggle('disabled')
    }
  },

  turnActivePage(targetPage) {
    for (li of paginator.children) {
      if (li.classList.contains('active')) {
        li.classList.toggle('active')
      }
    }
    targetPage.parentElement.classList.toggle('active')
    modal.currentPage = targetPage
  },

  renderUserList(dataList) {
    dataPanel.innerHTML = ""
    dataList.forEach((element) => {
      dataPanel.innerHTML +=`
        <div class="card mb-1 col-md-2 col-sm-3 col-6" style="width: 18rem;">
          <img src="${element.avatar}" class="card-img-top shadow-lg user-avatar" alt="user-avatar" 
          data-toggle="modal" data-target="#user-modal" data-id="${element.id}">
          <div class="card-body p-1">
            <p class="text-center text-monospace mb-1">${element.name + " " + element.surname}</p>
          </div>
        </div>
      `
    });
  },

  switchToList(dataList) {
    let rawHTML = `<ul class="list-group w-100 my-3">`
    dataList.forEach(element => {
      rawHTML += `
        <li class="list-group-item py-0 my-1 d-flex justify-content-between">
          <div class="d-flex align-items-center">
            <img src="${element.avatar}" alt="user-avatar" class="img-fluid my-1 shadow user-avatar" data-toggle="modal" data-target="#user-modal" data-id="${element.id}">
            <span class="d-flex">
              <h5 class="text-monospace mx-3">${element.name + " " + element.surname}</h5>
              <h5 class="text-monospace mx-3">From: ${element.region}<h5>
            </span>
          </div>
          <span class="d-flex align-items-center" id="button-group">  
            <button type="button" class="btn btn-primary btn-show-detail mx-2" data-toggle="modal"
                data-target="#user-modal" data-id="${element.id}">More Info</button>
          </span>
        </li>
      `
    })
    rawHTML += `</ul>`
    dataPanel.innerHTML = rawHTML
  },

  showUserDetail(id) {
    const userModalTitle = document.querySelector("#user-modal-title");
    const userModalInfo = document.querySelector("#user-modal-info");
    const userModalEmail = document.querySelector("#user-modal-email");
    axios
      .get(INDEX_URL + id)
      .then((response) => {
        console.log(response);
        const userData = response.data;
        userModalTitle.innerText = userData.name + userData.surname;
        userModalEmail.innerText = userData.email;
        addBtn.dataset.id = `${userData.id}`
        userModalInfo.innerHTML = `
        <div class="row">
          <img class="col-6" src="${userData.avatar}">
          <ul class="col-6 m-0 d-flex flex-column justify-content-center">
            <li class="my-1">Gender: ${userData.gender}</li>
            <li class="my-1">Age: ${userData.age}</li>
            <li class="my-1">Region: ${userData.region}</li>
            <li class="my-1">Birthday: ${userData.birthday}</li>
          </ul>
        </div>
        `;
      })
      .catch((error) => {
        console.log(error);
      });
  },

  renderRegionMenu(dataList){
    const regionSet = new Set()
    let menuContent = ``
    dataList.forEach( element => {
      regionSet.add(element.region)
    })
    console.log(regionSet)
    regionSet.forEach(region => {
      menuContent += `<a class="dropdown-item font-weight-bold text-monospace" href="#" data-region="${region}">${region}</a>`
    })
    regionMenu.innerHTML = menuContent
  },

  renderAgeMenu(){
    let menuContent = ``
    for(i = 2; i < 8; i++){
      menuContent += `
        <a class="dropdown-item font-weight-bold text-monospace" 
        href="#" data-age="${i}">${i}0 ~ ${i}9</a>
      `
    }
    ageMenu.innerHTML = menuContent
  },

  renderGenderMenu (dataList) {
    const genderSet = new Set()
    let menuContent = ``
    dataList.forEach( element => {
      genderSet.add(element.gender)
    })
    genderSet.forEach(gender => {
      menuContent += `
        <a class="dropdown-item font-weight-bold text-monospace" 
        href="#" data-gender="${gender}">${gender}</a>
      `
    })
    genderMenu.innerHTML = menuContent
  },
  
  renderByDisplay (currentPageNum) {
    modal.currentDisplay === 'card' ?
    this.renderUserList(modal.getUsersByPage(currentPageNum)) : this.switchToList(modal.getUsersByPage(currentPageNum))
  },

  setPaginator (currentPageNum, currentPage, currentTotalPages) {
    this.turnActivePage(currentPage)
    this.toggleNextPage(currentPageNum, currentTotalPages)
    this.togglePreviousPage(currentPageNum)
  },
}

// Modal
const modal = {
  friends : JSON.parse(localStorage.getItem('friends')) || [],
  userList : [],
  USERS_PER_PAGE : 16,
  filterUserList : [],
  currentPageNum : 1,
  currentDisplay : 'card',
  currentPage : document.querySelector('.numeric-page'),
  currentTotalPages : paginator.children.length - 2,

  getUsersByPage(page) {
    const dataList = (this.filterUserList.length) ? this.filterUserList : this.userList
    return dataList.slice((page - 1) * this.USERS_PER_PAGE, page * this.USERS_PER_PAGE)
  },

  addToFriends(id) {
    const userAdded = this.userList.find(user => user.id === id)
    if (!this.friends.some(user => user.id === id)) {
      this.friends.push(userAdded)
      localStorage.setItem('friends', JSON.stringify(this.friends))
      alert(`Add ${userAdded.name + " " + userAdded.surname} to your friends list successfully!`)
    } else {
      alert('This user is already your friend')
    }
  },
  
  searchByKeywords(keywords) {
    keywords = keywords.trim().toLowerCase()
    this.filterUserList = this.userList.filter(user =>
      user.name.toLowerCase().includes(keywords) || user.surname.toLowerCase().includes(keywords)
    )
    if (!this.filterUserList) {
      alert("Can't find users with this keywords")
      return
    }
    view.setPageDefault()
  },
  
  filterByRegion(region){
    this.filterUserList = this.userList.filter(user => 
      user.region === region
    )
    view.setPageDefault()
    console.log(this.filterUserList)
  },
  
  filterByAge(age){
    const minAge = age * 10
    const maxAge = minAge + 9
    this.filterUserList = this.userList.filter(user =>
      user.age >= minAge && user.age <= maxAge
    )
    view.setPageDefault()
    console.log(this.filterUserList)
  },
  
  filterByGender(gender){
    this.filterUserList = this.userList.filter(user => 
      user.gender === gender
    )
    view.setPageDefault()
    console.log(this.filterUserList)
  },
}

// Controller
const controller = {
  dispatchEvents () {
    dataPanel.addEventListener("click", function onPanelClicked(event) {
      if (event.target.matches(".user-avatar") || event.target.matches(".btn-show-detail")) {
        view.showUserDetail(Number(event.target.dataset.id));
      }
    })
    
    paginator.addEventListener("click", function onPageClicked(event) {
      if (event.target.matches(".numeric-page")) {
        modal.currentPageNum = Number(event.target.dataset.id)
        view.renderByDisplay(modal.currentPageNum)
        view.setPaginator(modal.currentPageNum, event.target, modal.currentTotalPages)
      }
    
      if (event.target.matches(".previous-page")) {
        if (modal.currentPageNum > 1) {
          modal.currentPageNum -= 1
          modal.currentPage = modal.currentPage.parentElement.previousElementSibling.children[0]
          view.renderByDisplay(modal.currentPageNum)
          view.setPaginator(modal.currentPageNum, modal.currentPage, modal.currentTotalPages)
        }
      }
    
      if (event.target.matches(".next-page")) {
        if (modal.currentPageNum < modal.currentTotalPages) {
          modal.currentPageNum += 1
          modal.currentPage = modal.currentPage.parentElement.nextElementSibling.children[0]
          view.renderByDisplay(modal.currentPageNum)
          view.setPaginator(modal.currentPageNum, modal.currentPage, modal.currentTotalPages)
        }
      }
    })
    
    addBtn.addEventListener('click', function addBtnClicked(event) {
      modal.addToFriends(Number(addBtn.dataset.id))
    })
    
    searchBtn.addEventListener('click', function searchBtnClicked(event) {
      event.preventDefault()
      const keywords = input.value
      modal.searchByKeywords(keywords)
    })
    
    panelSwitch.addEventListener('click', function switchPanel(event) {
      if (event.target.matches('.panel-list')) {
        modal.currentDisplay = 'list'
        view.switchToList(modal.getUsersByPage(modal.currentPageNum))
      }
      if (event.target.matches('.panel-card')) {
        modal.currentDisplay = 'card'
        view.renderUserList(modal.getUsersByPage(modal.currentPageNum))
      }
    })
    
    regionMenu.addEventListener('click', function regionMenuClicked(event) {
      if (event.target.matches('.dropdown-item')) {
        const region = event.target.dataset.region
        modal.filterByRegion(region)
      }
    })
    
    ageMenu.addEventListener('click', function ageMenuClicked(event){
      if (event.target.matches('.dropdown-item')) {
        const age = event.target.dataset.age
        modal.filterByAge(age)
      }
    })
    
    genderMenu.addEventListener('click', function genderMenuClicked(event){
      if (event.target.matches('.dropdown-item')) {
        const gender = event.target.dataset.gender
        modal.filterByGender(gender)
      }
    })
  }
}

// Dispatch Events 
controller.dispatchEvents()
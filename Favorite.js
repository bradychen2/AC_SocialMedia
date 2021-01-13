const dataPanel = document.querySelector("#data-panel")
const paginator = document.querySelector(".pagination")
const rmvBtn = document.querySelector('.btn-danger')
const input = document.querySelector('#input-keywords')
const searchBtn = document.querySelector('#search-btn')
const panelSwitch = document.querySelector('#panel-switch')

const view = {
  setPageDefault() {
    modal.currentDisplay === 'card' ?
      this.renderUserList(modal.getUsersByPage(1)) : this.switchToList(modal.getUsersByPage(1))
    const dataList = (modal.filterUserList.length) ? modal.filterUserList : modal.friends
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
  
    const userData = modal.friends.find(user => user.id === id);
    userModalTitle.innerText = userData.name + userData.surname;
    userModalEmail.innerText = userData.email;
    rmvBtn.dataset.id = `${userData.id}`
    userModalInfo.innerHTML = `
        <div class="row">
          <img class="col-6" src="${userData.avatar}">
          <ul class="col-6">
            <li>Gender: ${userData.gender}</li>
            <li>Age: ${userData.age}</li>
            <li>Region: ${userData.region}</li>
            <li>Birthday: ${userData.birthday}</li>
          </ul>
        </div>
        `;
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
  friends : JSON.parse(localStorage.getItem('friends')),
  filterUserList : [],
  USERS_PER_PAGE : 16,
  currentPageNum : 1,
  currentDisplay : 'card',
  currentTotalPages : 1,
  currentPage : document.querySelector('.numeric-page'),

  getUsersByPage(page) {
    if (!this.friends) return
    const dataList = (this.filterUserList.length) ? this.filterUserList : this.friends
    return dataList.slice((page - 1) * this.USERS_PER_PAGE, page * this.USERS_PER_PAGE)
  },

  determinePageNum(renewTotalPages, eventTarget) {
    if (eventTarget.matches('.btn-danger')) { // remove evenet
      if (renewTotalPages === this.currentTotalPages) { // Total page doesn't change
        this.currentPage = paginator.lastElementChild.previousElementSibling.firstElementChild
        return
      } else { // Total page changed then turn to previous page
        if (this.currentPageNum > 1) {
          this.currentPageNum -= 1
          this.currentPage = paginator.lastElementChild.previousElementSibling.firstElementChild
          this.currentTotalPages = renewTotalPages
          return
        }
      }
    }
  },

  searchByKeywords(keywords) {
    keywords = keywords.trim().toLowerCase()
    if (!this.friends) return
    this.filterUserList = this.friends.filter(user =>
      user.name.toLowerCase().includes(keywords) || user.surname.toLowerCase().includes(keywords)
    )
    if (!this.filterUserList.length) {
      alert('There is no result with this keywords!')
      return
    }
    view.setPageDefault()
  },
  
  removeFromFriends(id) {
    const userRemoved = this.friends.find(user => user.id === id)
    const userRemovedId = this.friends.findIndex(user => user.id === id)
    if (!this.friends.some(user => user.id === id)) {
      return
    } else {
      this.friends.splice(userRemovedId, 1)
      localStorage.setItem('friends', JSON.stringify(this.friends))
      alert(`Remove ${userRemoved.name + " " + userRemoved.surname} from your friends list successfully!`)
    }
  },

  removeFromFilter(id) {
    const userRemovedId = this.filterUserList.findIndex(user => user.id === id)
    if (!this.filterUserList.some(user => user.id === id)) {
      return
    } else {
      this.filterUserList.splice(userRemovedId, 1)
    }
  },
}

// Controller
const controller = {
  initiatePage () {
    view.setPageDefault()
  },

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
    
    rmvBtn.addEventListener('click', function rmvBtnClicked(event) {
      modal.removeFromFriends(Number(event.target.dataset.id))
      modal.removeFromFilter(Number(event.target.dataset.id))
      const dataList = (modal.filterUserList.length) ? modal.filterUserList : modal.friends
      view.createPages(dataList)
      const renewTotalPages = paginator.children.length - 2
      modal.determinePageNum(renewTotalPages, event.target)
      view.setPaginator (modal.currentPageNum, modal.currentPage, modal.currentTotalPages)
      view.renderByDisplay (modal.currentPageNum)
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
  }
}

controller.initiatePage()
controller.dispatchEvents()

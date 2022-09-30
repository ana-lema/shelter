/* Navigation */
document.addEventListener('DOMContentLoaded', function(event) {
  menuToggle.addEventListener('click', {
    handleEvent(event) {
      document.body.classList.toggle('nav-active');
    }
  });

  navOverlay.addEventListener('click', {
    handleEvent(event) {
      document.body.classList.remove('nav-active');
    }
  });

  let headerLinks = document.querySelectorAll('.header__link');
  for (let link of headerLinks) {
    link.addEventListener('click', {
      handleEvent(event) {
        document.body.classList.remove('nav-active');
      }
    });
  }
});

/* Modal */
document.addEventListener('DOMContentLoaded', function(event) {
  let modalElement = document.querySelector('.modal');
  modalElement.addEventListener('click', {
    handleEvent(event) {
      event.stopPropagation();

      let modalButton = document.querySelector('.modal__close-button');
      if (event.target == modalButton) {
        document.body.classList.remove('modal-active');
      }
    }
  });

  modal.addEventListener('click', {
    handleEvent(event) {
      document.body.classList.remove('modal-active');
    }
  });
});

/* Pets grid and Modal contents */
document.addEventListener('DOMContentLoaded', function(event) {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', 'pets.json');
  xhr.responseType = 'json';
  xhr.send();

  xhr.onload = function() {
    let petsObj = xhr.response;
    let gridBody = document.querySelector('.pets-grid');
    let mobile = window.matchMedia('(max-width: 767px)');
    let tablet = window.matchMedia('(max-width: 1279px)');

    init(mobile, tablet);

    function init(mobile, tablet) {
      if (mobile.matches) pageSize = 3;
      else if (tablet.matches) pageSize = 6;
      else pageSize = 8;
    }

    function buildArray() {
      let numArray = [];

      for (let i = 0; i < 6; i++) {
        let arrayShort = [];
        while (arrayShort.length < 8) {
          let randomNum = Math.floor(Math.random() * 8);

          if (arrayShort.length < 4) {
            if ((arrayShort.indexOf(randomNum) === -1) && (randomNum != numArray[numArray.length - 1]) && (randomNum != numArray[numArray.length - 2]) && (randomNum != numArray[numArray.length - 3])) {
              arrayShort.push(randomNum);
            }
          }
          else {
            if (arrayShort.indexOf(randomNum) === -1) {
              arrayShort.push(randomNum);
            }
          }

        }
        numArray = numArray.concat(arrayShort);
      }
      return numArray;
    }

    // Build pages
    buildPages();

    function buildPages() {
      let numArray = buildArray();
      let pageCounter = 0;
      let pageHTML = '<div class="pets-grid__page active" data-page-num="0">';

      for (let i = 0; i < numArray.length; i++) {
        if ((i % pageSize == 0) && (i != 0)) {
          pageCounter++;
          pageHTML += '</div><div class="pets-grid__page" data-page-num="' + pageCounter + '">';
        }

        pageHTML += '<div class="pets-grid__item"><div class="pets-card" data-card-num="' + numArray[i] + '"><img src="' + petsObj[numArray[i]].img + '" alt="" /><h4>' + petsObj[numArray[i]].name + '</h4><button class="button button_secondary">Learn more</button></div></div>';
      }

      gridBody.innerHTML = pageHTML;
    }

    // Pagination
    paginationButtonsActivity();

    function paginationButtonsActivity() {
      let paginationButtons = document.querySelectorAll('.pagination .button');
      let paginationButtonLast = document.querySelector('.pagination .button_last');
      let paginationButtonPrev = document.querySelector('.pagination .button_prev');
      let paginationButtonNext = document.querySelector('.pagination .button_next');
      let paginationButtonFirst = document.querySelector('.pagination .button_first');

      let pageCurrent = document.querySelector('.pets-grid__page.active');
      let pageNext = pageCurrent.nextElementSibling;
      let pagePrev = pageCurrent.previousElementSibling;

      if (!pageNext) {
        paginationButtonFirst.removeAttribute('disabled', 'disabled');
        paginationButtonPrev.removeAttribute('disabled', 'disabled');
        paginationButtonNext.setAttribute('disabled', 'disabled');
        paginationButtonLast.setAttribute('disabled', 'disabled');
      }
      else if (!pagePrev) {
        paginationButtonNext.removeAttribute('disabled', 'disabled');
        paginationButtonLast.removeAttribute('disabled', 'disabled');
        paginationButtonFirst.setAttribute('disabled', 'disabled');
        paginationButtonPrev.setAttribute('disabled', 'disabled');
      }
      else if (pageNext && pagePrev) {
        for (let button of paginationButtons) {
          button.removeAttribute('disabled', 'disabled');
        }
      }
    }

    let paginationButtons = document.querySelectorAll('.pagination button');
    let paginationPageButton = document.querySelector('.pagination .button_current');
    for (let button of paginationButtons) {
      button.addEventListener('click', {
        handleEvent(event) {
          let pageCurrent = document.querySelector('.pets-grid__page.active');
          let pageNext = pageCurrent.nextSibling;
          let pagePrev = pageCurrent.previousSibling;
          let pageFirst = gridBody.firstElementChild;
          let pageLast = gridBody.lastElementChild;

          if (button.classList.contains('button_next')) {
            let pageNextNum = Number(pageNext.getAttribute('data-page-num')) + 1;
            pageCurrent.classList.remove('active');
            pageNext.classList.add('active');
            paginationPageButton.innerHTML = pageNextNum;
          }
          else if (button.classList.contains('button_last')) {
            let pageLastNum = Number(pageLast.getAttribute('data-page-num')) + 1;
            pageCurrent.classList.remove('active');
            pageLast.classList.add('active');
            paginationPageButton.innerHTML = pageLastNum;
          }
          else if (button.classList.contains('button_prev')) {
            let pagePrevNum = Number(pagePrev.getAttribute('data-page-num')) + 1;
            pageCurrent.classList.remove('active');
            pagePrev.classList.add('active');
            paginationPageButton.innerHTML = pagePrevNum;
          }
          else if (button.classList.contains('button_first')) {
            let pageFirstNum = Number(pageFirst.getAttribute('data-page-num')) + 1;
            pageCurrent.classList.remove('active');
            pageFirst.classList.add('active');
            paginationPageButton.innerHTML = pageFirstNum;
          }

          paginationButtonsActivity();
        }
      });
    }

    // Build modal
    buildModal();

    function buildModal() {
      let petCards = document.querySelectorAll('.pets-card');

      for (let card of petCards) {
        card.addEventListener('click', {
          handleEvent(event) {
            document.body.classList.add('modal-active');

            let targetElement = event.currentTarget;
            let num = Number(targetElement.getAttribute('data-card-num'));

            let modalHTML = '<div class="pets-info"><div class="pets-info__img"><img src="' + petsObj[num].img + '" alt="" /></div><div class="pets-info__txt"><h3>' + petsObj[num].name + '</h3><h4>' + petsObj[num].type +' - ' + petsObj[num].breed +'</h4><h5>' + petsObj[num].description + '</h5><ul><li><strong>Age:</strong> ' + petsObj[num].age +'</li><li><strong>Inoculations:</strong> ' + petsObj[num].inoculations + '</li><li><strong>Diseases:</strong> ' + petsObj[num].diseases +'</li><li><strong>Parasites:</strong> ' + petsObj[num].parasites + '</li></ul></div></div>';

            let modalBody = document.querySelector('.modal__body');
            modalBody.innerHTML = modalHTML;
          }
        });
      }
    }
  };
});

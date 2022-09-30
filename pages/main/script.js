/* Navigation */
document.addEventListener('DOMContentLoaded', function(event) {
  menuToggle.addEventListener('click', {
    handleEvent(event) {
      document.body.classList.toggle('nav-active');
    }
  });

  overlay.addEventListener('click', {
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

/* Carousel and Modal contents */
document.addEventListener('DOMContentLoaded', function(event) {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', 'pets.json');
  xhr.responseType = 'json';
  xhr.send();

  xhr.onload = function() {
    let petsObj = xhr.response;
    let carouselBody = document.querySelector('#our-friends .carousel__body');
    let randomNumArr = [];

    while (randomNumArr.length < petsObj.length) {
      let randomNum = Math.floor(Math.random() * petsObj.length);

      if (randomNumArr.indexOf(randomNum) === -1) {
        randomNumArr.push(randomNum);
      }
    }

    // Build carousel
    let petCardHTML = '<div class="carousel__slide">';
    for (let i = 0; i < 3; i++) {
      let num = randomNumArr[i];
      petCardHTML += '<div class="carousel__item"><div class="pets-card" data-card-num="' + num + '"><img src="' + petsObj[num].img + '" alt="" /><h4>' + petsObj[num].name + '</h4><button class="button button_secondary">Learn more</button></div></div>';
    }
    petCardHTML += '</div>';
    carouselBody.innerHTML = petCardHTML;

    // Carousel navigation
    let carouselButtons = document.querySelectorAll('.carousel__button');
    for (let button of carouselButtons) {
      button.addEventListener('click', {
        handleEvent(event) {
          let carouselOldItems = document.querySelector('.carousel__slide');
          carouselBody.style.position = 'absolute';
          carouselBody.style.top = 0;
          carouselBody.style.transition = '.5s ease all';
          button.setAttribute('disabled', 'disabled');

          if (event.target.classList.contains('carousel__button_next')) {
            let newPetCardsHTML = rebuildCarousel();
            carouselBody.insertAdjacentHTML('beforeend', newPetCardsHTML);
            carouselBody.style.transform = 'translateX(-50%)';
            setTimeout(() => {
              carouselBody.style.transition = 'none';
              carouselBody.style.transform = 'translateX(0%)';
              carouselOldItems.remove();
              button.removeAttribute('disabled', 'disabled');
              buildModal();
            }, 500);
          }
          else if (event.target.classList.contains('carousel__button_prev')) {
            let newPetCardsHTML = rebuildCarousel();
            carouselBody.style.right = 0;
            carouselBody.insertAdjacentHTML('afterbegin', newPetCardsHTML);
            carouselBody.style.transform = 'translateX(50%)';
            setTimeout(() => {
              carouselBody.style.transition = 'none';
              carouselBody.style.right = 'auto';
              carouselBody.style.transform = 'translateX(0%)';
              carouselOldItems.remove();
              button.removeAttribute('disabled', 'disabled');
              buildModal();
            }, 500);
          }
        }
      });
    }

    // Rebuild carousel
    function rebuildCarousel() {
      let carouselCards = document.querySelectorAll('.pets-card');

      let currentCardsNumArr = [];
      for (let card of carouselCards) {
        let cardNum = Number(card.getAttribute('data-card-num'));

        currentCardsNumArr.push(cardNum);
      }

      let nextCardsNumArr = [];
      while (nextCardsNumArr.length < 3) {
        let randomNum = Math.floor(Math.random() * 8);

        if ((currentCardsNumArr.indexOf(randomNum) === -1) && (nextCardsNumArr.indexOf(randomNum) === -1)) {
          nextCardsNumArr.push(randomNum);
        }
      }

      let newPetCardsHTML = '<div class="carousel__slide">';
      for (let i = 0; i < 3; i++) {
        let num = nextCardsNumArr[i];
        newPetCardsHTML += '<div class="carousel__item"><div class="pets-card" data-card-num="' + num + '"><img src="' + petsObj[num].img + '" alt="" /><h4>' + petsObj[num].name + '</h4><button class="button button_secondary">Learn more</button></div></div>';
      }

      newPetCardsHTML += '</div>';
      return newPetCardsHTML;
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

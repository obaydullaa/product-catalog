//Data storage
//memory (temporary)
//database
// localStorage, sessionStorage

;(function () {
  const formElm = document.querySelector('form')
  const nameInputElm = document.querySelector('.product-name')
  const priceInputElm = document.querySelector('.product-price')
  const listGroupElm = document.querySelector('.list-group')
  const filterElm = document.querySelector('#filter')
  const addProductElm = document.querySelector('.add-product')

  //tracking item
  let products = []

  function showAllItemsToUI(items) {
    listGroupElm.innerHTML = ''
    items.forEach((item) => {
      const listElm = `<li class="list-group-item item-${item.id} collection-item">
    <strong>${item.name}</strong>- <span class="price">$${item.price}</span>
    <i class="fa fa-pencil-alt edit-item float-right"></i>
    <i class="fa fa-trash delete-item float-right"></i>
    </li>`

      listGroupElm.insertAdjacentHTML('afterbegin', listElm)
    })
  }

  function updateAfterRemove(products, id) {
    return products.filter((product) => product.id !== id)
  }

  function removeItemFromDataStore(id) {
    const productsAfterDelete = updateAfterRemove(products, id)
    products = productsAfterDelete
  }

  function removeItemFromUI(id) {
    document.querySelector(`.item-${id}`).remove()
  }

  function getItemID(elm) {
    const liElm = elm.parentElement
    return Number(liElm.classList[1].split('-')[1])
  }

  function resetInput() {
    nameInputElm.value = ''
    priceInputElm.value = ''
  }

  function addItemToUI(id, name, price) {
    //generate id
    const listElm = `<li class="list-group-item item-${id} collection-item">
            <strong>${name}</strong>- <span class="price">$${price}</span>
            <i class="fa fa-trash delete-item float-right"></i>
            <i class="fa fa-pencil-alt edit-item float-right"></i>
          </li>`

    listGroupElm.insertAdjacentHTML('afterbegin', listElm)
  }

  function validateInput(name, price) {
    console.log('validateInput', name, price)
    let isError = false
    if (!name || name.length < 5) {
      isError = true
    }

    if (!price || isNaN(price) || Number(price) <= 0) {
      isError = true
    }

    return isError
  }

  function receiveInputs() {
    const name = nameInputElm.value
    const price = priceInputElm.value
    return {
      name,
      price,
    }
  }

  function addItemToStorage(product) {
    let products
    if (localStorage.getItem('storeProducts')) {
      products = JSON.parse(localStorage.getItem('storeProducts'))
      products.push(product)
      //update to localStorage
      localStorage.setItem('storeProducts', JSON.stringify(products))
    } else {
      products = []
      products.push(product)
      //update to localStorage
      localStorage.setItem('storeProducts', JSON.stringify(products))
    }
  }

  function removeProductFromStorage(id) {
    //pick from localStorage
    const products = JSON.parse(localStorage.getItem('storeProducts'))
    //filter
    const productsAfterRemove = updateAfterRemove(products, id)
    //save data to localStorage
    localStorage.setItem('storeProducts', JSON.stringify(productsAfterRemove))
  }

  function populateUIInEditState(product) {
    nameInputElm.value = product.name
    priceInputElm.value = product.price
  }

  function showUpdateBtn() {
    const elm = `<button type="button" class="btn mt-3 btn-block btn-secondary update-product">Update</button>`
    //hide the submit button
    addProductElm.style.display = 'none'
    formElm.insertAdjacentHTML('beforeend', elm)
  }

  function updateProductsToStorage(updatedProduct) {
    if (localStorage.getItem('storeProducts')) {
      localStorage.setItem('storeProducts', JSON.stringify(products))
    }
    // if (localStorage.getItem('storeProducts')) {
    //   const products = JSON.parse(localStorage.getItem('storeProducts'))
    //   const updatedProducts = products.map((product) => {
    //     if (product.id === updatedProduct.id) {
    //       //item should be updated
    //       return {
    //         id: updatedProduct.id,
    //         name: updatedProduct.name,
    //         price: updatedProduct.price,
    //       }
    //     } else {
    //       //no update
    //       return product
    //     }
    //   })
    //   localStorage.setItem('storeProducts', JSON.stringify(updatedProducts))
    // }
  }

  function init() {
    let updatedItemId
    formElm.addEventListener('submit', (evt) => {
      //prevent default action(browser reloading)
      evt.preventDefault()
      //receiving input
      const { name, price } = receiveInputs()
      //validate input
      const isError = validateInput(name, price)

      if (isError) {
        alert('please provide valid input')
        return
      }

      //generate item
      const id = products.length

      const product = {
        id: id,
        name: name,
        price: price,
      }

      //add item to data store
      products.push(product)
      //add item to the UI
      addItemToUI(id, name, price)

      //add Item to localStorage
      addItemToStorage(product)
      //reset the input
      resetInput()
    })

    filterElm.addEventListener('keyup', (evt) => {
      //filter depend on this value
      const filterValue = evt.target.value
      const filteredArr = products.filter((product) =>
        product.name.includes(filterValue)
      )
      //show Item to UI
      showAllItemsToUI(filteredArr)
    })

    //deleting item (event delegation)
    listGroupElm.addEventListener('click', (evt) => {
      if (evt.target.classList.contains('delete-item')) {
        const id = getItemID(evt.target)
        //delete item from UI
        removeItemFromUI(id)
        //delete item from  data store
        removeItemFromDataStore(id)
        //delete item from storage
        removeProductFromStorage(id)
      } else if (evt.target.classList.contains('edit-item')) {
        //pick the item id
        updatedItemId = getItemID(evt.target)
        //find the item
        const foundProduct = products.find(
          (product) => product.id === updatedItemId
        )

        //populate the item data to UI
        populateUIInEditState(foundProduct)
        //show updated button
        if (!document.querySelector('.update-product')) {
          showUpdateBtn()
        }
      }
    })

    formElm.addEventListener('click', (evt) => {
      if (evt.target.classList.contains('update-product')) {
        //pick the data from the field
        const { name, price } = receiveInputs()
        //validate the input
        const isError = validateInput(name, price)

        if (isError) {
          alert('please provide valid input')
          return
        }
        //updated data should be updated to data store
        products = products.map((product) => {
          if (product.id === updatedItemId) {
            //item should be updated
            return {
              id: product.id,
              name,
              price,
            }
          } else {
            //no update
            return product
          }
        })

        //reset Input
        resetInput()

        //show Submit button
        addProductElm.style.display = 'block'
        //hide update button

        //updated data should be updated to UI
        showAllItemsToUI(products)
        document.querySelector('.update-product').remove()
        //updated data should be updated to localStorage
        const product = {
          id: updatedItemId,
          name,
          price,
        }

        updateProductsToStorage(product)
      }
    })

    document.addEventListener('DOMContentLoaded', (e) => {
      //checking item into localStorage
      if (localStorage.getItem('storeProducts')) {
        products = JSON.parse(localStorage.getItem('storeProducts'))
        //show items to UI
        showAllItemsToUI(products)
        //populate temporary data store
      }
    })
  }

  init()
})()

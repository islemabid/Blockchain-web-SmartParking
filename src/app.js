App = {
  loading: false,
  contracts: {},

  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render() 

  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  loadAccount: async () => {
    // Set the current blockchain account
    App.accounts = await web3.eth.getAccounts();
    
    console.log(App.accounts[0])
  },

  
  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    const parkingSpots = await $.getJSON('SmartParking.json')
    App.contracts.SmartParking = TruffleContract(parkingSpots)
    App.contracts.SmartParking.setProvider(App.web3Provider)
    console.log(parkingSpots)
    // Hydrate the smart contract with values from the blockchain
    App.smartParking = await App.contracts.SmartParking.deployed()
  },

render: async () => {
    // Prevent double render
    if (App.loading) {
      return
    }

    // Update app loading state
    App.setLoading(true)

    console.log("test22",App.accounts)
    // Render Account
    $('#account').html(App.accounts)

        // Render Tasks
    await App.renderTasks()

    // Update loading state
    App.setLoading(false)

  },
  renderTasks: async () => {
    // Load the total task count from the blockchain
    const spotCount = await App.smartParking.spotCount()
    const $taskTemplate = $('.taskTemplate')

    // Render out each task with a new task template
    for (var i = 1; i <= spotCount; i++) {
      // Fetch the task data from the blockchain
      const spot = await App.smartParking.spots(i)
      const spotId = spot[0].toNumber()
      const spotContent = spot[1]
      const spotCompleted = spot[2]

      // Create the html for the task
      const $newTaskTemplate = $taskTemplate.clone()
      $newTaskTemplate.find('.content').html(spotContent)
      $newTaskTemplate.find('input')
                      .prop('name', spotId)
                      .prop('checked', spotCompleted)
                      .on('click', App.toggleCompleted)

      // Put the task in the correct list
      if (spotCompleted) {
        $('#completedTaskList').append($newTaskTemplate)
      } else {
        $('#taskList').append($newTaskTemplate)
      }

      // Show the task
      $newTaskTemplate.show()
    }
  },

createTask: async () => {
    App.setLoading(true)
    const content = $('#newTask').val()
    await App.smartParking.createSpot(content, {from: App.accounts[0]})
    //await App.smartParking.createSpot(content)
    console.log("done")
    window.location.reload()
  },

toggleCompleted: async (e) => {
    App.setLoading(true)
    const taskId = e.target.name
    await App.smartParking.toggleCompleted(taskId, {from: App.accounts[0]})
    //await App.smartParking.toggleCompleted(taskId)
    window.location.reload()
  },


 


setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  },

}

$(() => {
  $(window).load(() => {
    App.load()
  })
})

class UI {
  constructor() {
      this.budgetFeedback  = document.querySelector(".budget-feedback");
      this.expenseFeedback = document.querySelector(".expense-feedback");
      this.budgetForm      = document.getElementById("budget-form");
      this.budgetInput     = document.getElementById("budget-input");
      this.budgetAmount    = document.getElementById("budget-amount");
      this.expenseAmount   = document.getElementById("expense-amount");
      this.balance         = document.getElementById("balance");
      this.balanceAmount   = document.getElementById("balance-amount");
      this.expenseForm     = document.getElementById("expense-form");
      this.expenseInput    = document.getElementById("expense-input");
      this.amountInput     = document.getElementById("amount-input");
      this.expenseList     = document.getElementById("expense-list");
      this.itemList        = [];
      this.itemID          = 0;
  }

  //submit budget method
   submitBudgetForm(){
      let budgetValue = this.budgetInput.value;
      if(budgetValue == '' || budgetValue < 0 ){
          this.budgetFeedback.classList.add('showItem');
          this.budgetFeedback.innerHTML = "<p>value should not empty or negative</p>";
          setTimeout(()=>{
              this.budgetFeedback.classList.remove('showItem');
          },4000);
      }
      else{
          this.budgetAmount.textContent = budgetValue;
          this.budgetInput.value='';
          this.showBalance();
      }
  }

  //show balance
  showBalance(){
        const expense = this.totalExpense();
        const total = parseInt(this.budgetAmount.textContent - expense);

        this.balanceAmount.textContent = total;

        if(total < 0 ){
            this.balance.classList.remove('showGreen','showBlack');
            this.balance.classList.add('showRed');
        }
        else if (total > 0 ){
            this.balance.classList.remove('showRed','showBlack');
            this.balance.classList.add('showGreen');
        }
        else if (total === 0 ){
            this.balance.classList.remove('showGreen','showRed');
            this.balance.classList.add('showBlack');
      }
  }
  //  submit expense form
  submitExpenseForm(){
      const expensevalue = this.expenseInput.value;
      const amountValue  = parseInt(this.amountInput.value);

      if(expensevalue == '' || amountValue =='' || amountValue < 0 || amountValue > this.balance ){
        this.expenseFeedback.classList.add('showItem');
        this.expenseFeedback.innerHTML ="<p>value should not empty or negative or greather than your budget</p>";
        setTimeout(()=>{
          this.expenseFeedback.classList.remove('showItem');
        },4000);

      }else{
           let amount              = parseInt(amountValue);
           this.expenseInput.value = '';
           this.amountInput.value  = '';
           let expense = {
             id     : this.itemID,
             title  : expensevalue,
             amount : amount
           };

           this.itemID++;
           this.itemList.push(expense);
           this.addExpense(expense);
           this.showBalance();
      }


  }
  //add Expense

    addExpense(expense){

        const div = document.createElement('div');
        div.classList.add('expense');

        div.innerHTML = `<div class="expense-item d-flex justify-content-between align-items-baseline">
            <h6 class="expense-title mb-0 text-uppercase list-item">-${expense.title}</h6>
            <h5 class="expense-amount mb-0 list-item">${expense.amount}</h5>
            <div class="expense-icons list-item">
                <a href="#" class="edit-icon mx-2" data-id="${expense.id}">
                <i class="fas fa-edit"></i>
                </a>
                <a href="#" class="delete-icon" data-id="${expense.id}">
                <i class="fas fa-trash"></i>
                </a></div></div>`;
      this.expenseList.appendChild(div);

  }

  // total expense
  totalExpense(){
      let total =0;
      if(this.itemList.length > 0 ){

          total = this.itemList.reduce((sum,item)=>{
              return (sum + item.amount);
          },0);
      }
      this.expenseAmount.textContent=total;
      return total;
  }


  editExpense(element){

    let id = parseInt(element.dataset.id);
    let parent = element.parentElement.parentElement.parentElement;

    let expense = this.itemList.filter(item=>{
      return item.id === id;
    });
    //remove expense from the expense list
    this.expenseList.removeChild(parent);
    // /// edit expense
    this.expenseInput.value = expense[0].title;
    this.amountInput.value = expense[0].amount;
    let  tempList = this.itemList.filter(item=>{
      return item.id !==id;
    });

    this.itemList = tempList;
    this.showBalance();
  }
  deleteExpense(element){
       let id = parseInt(element.dataset.id);
       let parent = element.parentElement.parentElement.parentElement;

       //remove expense from the expense list
       this.expenseList.removeChild(parent);
        let tempList = this.itemList.filter(item=>{
            return item.id !== id;
         })

         this.itemList = tempList;
         this.showBalance();


  }



}



function eventListener(){

    let budgetForm  = document.getElementById('budget-form');
    let expenseForm = document.getElementById('expense-form');
    let expenseList = document.getElementById('expense-list');
   // new object of UI
     const ui = new UI();


    //  Budget Form submit
    budgetForm.addEventListener('submit',function(event){
                    event.preventDefault();
                    ui.submitBudgetForm();
    });

    // Expense Form submit
    expenseForm.addEventListener('submit',function(event){
          event.preventDefault();
          ui.submitExpenseForm();
    });

    // expense List click
    expenseList.addEventListener('click',function(event){
        if(event.target.parentElement.classList.contains('edit-icon')){
              ui.editExpense(event.target.parentElement);
        }
        else if(event.target.parentElement.classList.contains('delete-icon')){
              ui.deleteExpense(event.target.parentElement);
        }
    });



}

document.addEventListener('DOMContentLoaded',function(){
  eventListener();
})

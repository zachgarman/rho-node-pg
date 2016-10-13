$(function() {

  getBooks();

  $('#book-form').on('submit', addBook);
  $('#book-list').on('click', '.delete', deleteBook);
  $('#book-list').on('click', '.save', saveBook);

});

function getBooks() {
  $.ajax({
    type: 'GET',
    url: '/books',
    success: displayBooks
  });
}
  // the response should be an array of objects
function displayBooks(response) {
  console.log(response);
  var $list = $('#book-list');
  $list.empty();
  response.forEach(function(book) {
    var $li = $('<div class="float-books"><li></li></div>');
    var $form = $('<form></form>');
    $form.append('<input name="title" type="text" value="' + book.title + '"/>');
    $form.append('<input name="author" type="text" value="' + book.author + '"/>');
    var date = new Date(book.published)
    $form.append('<input name="published" type="date" value="' + date.toISOString().slice(0,10) + '"/>');
    $form.append('<input name="publisher" type="text" value="' + book.publisher + '"/>');
    $form.append('<input name="edition" type="number" value="' + book.edition + '"/>');
    // make a button and store the id data on it.
    var $button = $('<button class="save" id="' + book.id + '">Update</button>');
    var $deleteButton = $('<button class="delete" id="' + book.id + '">Delete</button>');
    $button.data('id', book.id);
    $deleteButton.data('id', book.id);

    $form.append($button);
    $form.append($deleteButton);
    $li.append($form);
    $list.append($li);

  });
}

function saveBook(event) {
  event.preventDefault();
  if(confirm('Do you really want to change this book\'s information, bro?'))
  var $button = $(this);
  var $form = $button.closest('form');

  var data = $form.serialize();

  $.ajax({
    type: 'PUT',
    url: '/books/' + $button.data('id'),
    data: data,
    success: getBooks
  });

}

function deleteBook(event) {
  event.preventDefault();
  if (confirm('This is probably a bad idea.\nAre you sure you want to delete this book?')) {
    var id = $(this).attr('id');
    console.log(id);
    $.ajax({
      type: 'DELETE',
      url: '/books',
      data: {'id': id},
      success: getBooks
    });
  }
}

function addBook(event){
  event.preventDefault();
  var bookData = $(this).serialize();

  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookData,
    success: getBooks
  });

  $(this).find('input').val('');
}

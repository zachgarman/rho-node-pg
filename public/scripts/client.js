$(function() {

  getBooks();

  $('#book-form').on('submit', addBook);
  $('#book-list').on('click', 'button', deleteBook);

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
    $li.append('<p><strong>' + book.title + '</strong></p>');
    $li.append('<p><em>' + book.author + ' </em></p>');
    var date = new Date(book.published)
    $li.append('<p><time>' + date.toDateString() + '</time></p>');
    $li.append('<p>' + book.publisher + '</p>');
    $li.append('<p>Edition: ' + book.edition + '</p>');
    $li.append(('<button class="delete" id="' + book.id + '">Delete This Book</button>'));
    $list.append($li);

  });
}

function deleteBook(deleteButton) {
  var id = $(this).attr('id');
  console.log(id);
  $.ajax({
    type: 'DELETE',
    url: '/books',
    data: {'id': id},
    success: getBooks
  });
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

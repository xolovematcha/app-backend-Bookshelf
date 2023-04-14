const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (request, h) => {
    const {
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage, 
        reading,} = request.payload;

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    };

    if (readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    };

    const id = nanoid(10);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        id,
        finished,
        insertedAt,
        updatedAt,
    };

    books.push(newBook);
    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess){
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        // response.header('Access-Control-Allow-Origin', '*');
        return response;
    };

    const response = h.response({
        status: 'fail',
        message: 'Buku Gagal Ditambahkan',
    });

    response.code(500);
    return response;


};

const getAllBooksHandler = (request, h) => {
    const {name, reading, finished } = request.query;

    if(!name && !reading && !finished){
        const response = h.response({
            status: 'success',
            data: {
                books: books.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        })
        response.code(200);
        return response;
    };

    if(name){
        const filterBooksName = books.filter((book) => {
            const nameRegex = new RegExp(name, 'gi');
            return nameRegex.test(book.name);
        });

        const response = h.response({
            status: 'success',
            data: {
                books: filterBooksName.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        })
        response.code(200);
        return response;
    };

    if (reading) {
        const filterBooksReading = books.filter((book) => Number(book.reading) === Number(reading),
        );

        const response = h.response({
            status: 'success',
            data: {
                books: filterBooksReading.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        })
        response.code(200);
        return response;
    };

    const filterBooksFinished = books.filter((book) => Number(book.finished) === Number(finished),);
    const response = h.response({
            status: 'success',
            data: {
                books: filterBooksFinished.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        })
        response.code(200);
        return response;
};


  const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book = books.filter((book) => book.id === bookId)[0];

    if (book) {
        const response = h.response({
            status: 'success',
            data: {
                book,
        },
        
        })
        response.code(200);
        return response;
        
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const { 
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
     } = request.payload;
    // const updatedAt = new Date().toISOString();

    // const index = notes.findIndex((note) => note.id === id);

    if (!name) {
        const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message:
              'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
          })
        response.code(400);
        return response;
      }
    
    const finished = pageCount === readPage;
    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        books[index] = {
          ...books[index],
          name,
          year,
          author,
          summary,
          publisher,
          pageCount,
          readPage,
          reading,
          finished,
          updatedAt,
        };

    const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
    } 
    const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
        
};

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
    };

    const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = {addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler, };
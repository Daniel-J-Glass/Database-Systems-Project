const express = require("express");
const app = express();
var cors = require("cors");
const port = 3000;
const moment = require("moment");
const chalk = require("chalk");

app.use(cors());
app.use(express.json());

var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "library"
});

const tryWithMessage = (queryString, res) => {
  return new Promise((resolve, reject) => {
    connection.query(queryString, function(error, results, fields) {
      if (error) {
        res.json({ message: error.sqlMessage });
        console.error(chalk.red(error.sqlMessage));
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

const checkThatBorrowExistsWithCardNo = (cardno, res) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM borrower WHERE Card_id = ${cardno};`;

    tryWithMessage(query, res)
      .then(response => {
        if (response.length > 0) resolve(true);
        else resolve(false);
      })
      .catch(error => reject(error));
  });
};

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);

  connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });
});

app.get("/book/all", (req, res) => {
  connection.query(
    "SELECT BOOK.Isbn, BOOK.Title, BOOK.Cover, BOOK.Publisher, BOOK.Pages, GROUP_CONCAT(AUTHOR.Name) Name, GROUP_CONCAT(AUTHOR.Author_id) Author_id FROM BOOK NATURAL JOIN BOOK_AUTHOR NATURAL JOIN AUTHOR GROUP BY BOOK.Isbn ORDER BY RAND() LIMIT 20",
    function(error, results, fields) {
      if (error) {
        res.json({ error: error });
        console.log(error);
        throw error;
      } else {
        res.json({ results: results });
      }
    }
  );
});

app.get("/book/search/:searchTerm", (req, res) => {
  const searchTerm = req.params.searchTerm.replace(" ", "|");
  const query = `(SELECT BOOK.Isbn, BOOK.Title, BOOK.Cover, BOOK.Publisher, BOOK.Pages, GROUP_CONCAT(AUTHOR.Name) Name, GROUP_CONCAT(AUTHOR.Author_id) Author_id FROM BOOK NATURAL JOIN BOOK_AUTHOR NATURAL JOIN AUTHOR WHERE((BOOK.Isbn REGEXP '.*${searchTerm}.*') OR (BOOK.Title REGEXP '.*${searchTerm}.*') or (AUTHOR.Name REGEXP '.*${searchTerm}.*')) GROUP BY BOOK.Isbn ORDER BY Isbn) LIMIT 20;`;

  connection.query(query, function(error, results, fields) {
    if (error) {
      res.json({ error: error });
      console.log(error);
      throw error;
    } else {
      res.json({ results: results });
    }
  });
});

app.get("/loan/search/:term", (req, res) => {
  const searchTerm = req.params.term.replace(" ", "|");
  const query = `SELECT * FROM BOOK_LOAN NATURAL JOIN BOOK NATURAL JOIN BORROWER WHERE((BOOK_LOAN.Card_id REGEXP '.*${searchTerm}.*') OR (BORROWER.Bname REGEXP '.*${searchTerm}.*') or (BOOK_LOAN.Isbn REGEXP '.*${searchTerm}.*'));`;

  tryWithMessage(query, res).then(response => {
    res.json({ results: response });
  });
});

app.post("/book/checkout", (req, res) => {
  const dateOut = moment().toISOString();
  const dateDue = moment()
    .add(2, "weeks")
    .toISOString();

  const query = `SELECT *  FROM book_loan WHERE Card_id = ${req.body.Card_no} AND Date_in = ''`;
  const query2 = `SELECT *  FROM book_loan WHERE Isbn = ${req.body.Isbn} AND Date_in = ''`;
  const createQuery = `INSERT INTO BOOK_LOAN VALUES (default,'${req.body.Isbn}',${req.body.Card_no},'${dateOut}','${dateDue}','');`;

  checkThatBorrowExistsWithCardNo(req.body.Card_no, res).then(resp => {
    if (resp) {
      connection.query(query, function(error, results, fields) {
        // First, check to make sure that the user has no more than three books checked out at once
        if (error) {
          res.json({ message: error });
          console.log(error);
          throw error;
        } else {
          console.log(results.length);
          if (results.length > 2) {
            res.json({
              message:
                "You already have three books checked out. Please return a book before checking out a new one."
            });
          } else {
            // Next, check that no one has this book checked out already
            connection.query(query2, function(error, results, fields) {
              if (error) {
                res.json({ message: error });
                console.log(error);
                throw error;
              } else {
                if (results.length > 0) {
                  res.json({
                    message:
                      "Someone has this book checked out already. Please try again later."
                  });
                } else {
                  // Finally, check out the book if the other tests pass
                  connection.query(createQuery, function(
                    error,
                    results,
                    fields
                  ) {
                    if (error) {
                      res.json({ message: error });
                      console.log(error);
                      throw error;
                    } else {
                      res.json({ message: "Successfully borrowed book!" });
                    }
                  });
                }
              }
            });
          }
        }
      });
    } else
      res.json({
        message:
          "This card number is not associated with a user. Please try a different card number."
      });
  });
});

app.post("/book/checkin", (req, res) => {
  const dateIn = moment().toISOString();

  const query = `SELECT * FROM book_loan WHERE Isbn = ${req.body.Isbn} AND Date_in = ''`;
  const updateQuery = `UPDATE book_loan SET Date_in = '${dateIn}' WHERE Isbn = ${req.body.Isbn};`;

  checkThatBorrowExistsWithCardNo(req.body.Card_no, res).then(resp => {
    if (resp) {
      connection.query(query, function(error, results, fields) {
        if (error) {
          res.json({ message: error });
          throw error;
        } else {
          if (results.length !== 1)
            res.json({
              message:
                "You do not have this book checked out. You therefore cannot return it."
            });

          if (results.length === 1 && results[0].Card_id != req.body.Card_no)
            res.json({
              message:
                "Someone else has this book checked out, not you. You are therefore unable to return it."
            });

          if (results.length === 1 && results[0].Card_id == req.body.Card_no) {
            if (error) {
              res.json({ message: error });
              console.log(error);
              throw error;
            } else {
              connection.query(updateQuery, function(error, results, fields) {
                if (error) {
                  res.json({ message: error });
                  console.log(error);
                  throw error;
                } else {
                  res.json({ message: "Successfully returned book!" });
                }
              });
            }
          }
        }
      });
    } else
      res.json({
        message:
          "This card number is not associated with a user. Please try a different card number."
      });
  });
});

app.post("/borrower/new", (req, res) => {
  const query = `SELECT * FROM borrower WHERE Ssn=${req.body.ssn}`;
  const query2 = `SELECT * FROM borrower ORDER BY Ssn ASC`;

  tryWithMessage(query, res).then(results => {
    if (results.length > 0) {
      res.json({
        message:
          "A borrower with this SSN already exists. Please try with a different SSN."
      });
    } else {
      tryWithMessage(query2, res).then(results => {
        let largestId = Math.max.apply(
          Math,
          results.map(function(o) {
            return o.Card_id;
          })
        );

        if (largestId < 0) largestId = 1;

        const createNewBorrower = `INSERT INTO borrower VALUES (${largestId +
          1},'${req.body.ssn}','${req.body.name}','${req.body.address}','${
          req.body.phone
        }');`;

        tryWithMessage(createNewBorrower, res).then(results => {
          res.json({
            message:
              "Successfully created new borrower. Card number is " +
              (largestId + 1)
          });
        });
      });
    }
  });
});

app.post("/fines/refresh", (req, res) => {
  const getAllBookLoans = `SELECT * from book_loan;`;
  const allPromises = [];

  tryWithMessage(getAllBookLoans, res).then(globalResponse => {
    if (globalResponse.length === 0)
      console.log(chalk.blue("No fines to update..."));

    globalResponse.forEach(bookLoan => {
      let fineDate;

      if (!bookLoan.Date_in) {
        fineDate = moment();
      } else {
        fineDate = moment(bookLoan.Date_in);
      }

      const getFine = `SELECT * from fines WHERE Loan_id=${bookLoan.Loan_id}`;
      const fineAmount =
        Math.min(
          moment(bookLoan.Date_out)
            .add(2, "weeks")
            .diff(fineDate, "days"),
          0
        ) * -0.25;

      let finalQuery = "";

      tryWithMessage(getFine, res).then(response => {
        if (response.length > 0) {
          finalQuery = `UPDATE fines SET Fine_amt = '${fineAmount}' WHERE Loan_id = ${bookLoan.Loan_id};`;
        } else {
          finalQuery = `INSERT INTO fines VALUES (${bookLoan.Loan_id}, ${fineAmount}, false);`;
        }

        allPromises.push(tryWithMessage(finalQuery, res));

        if (allPromises.length === globalResponse.length) {
          console.log(chalk.blue(`Updating ${globalResponse.length} fines...`));

          Promise.all(allPromises)
            .then(response => {
              res.json({ message: "Updated all fines!" });
              console.log(chalk.green("Updated all fines!"));
            })
            .catch(error => {
              res.json({ message: "Error updating fines: " + error });
              console.error(chalk.red("Error updating fines: ", error));
            });
        }
      });
    });
  });
});

app.get("/fines/all", (req, res) => {
  console.log(chalk.blue(`INFO: Getting all fines in the fines table...`));
  const getAllFines = `SELECT Card_id, SUM(Fine_amt) as Fine_amt, MIN(Paid) as Paid FROM fines NATURAL JOIN book_loan GROUP BY Card_id;`;

  tryWithMessage(getAllFines, res).then(response => {
    console.log(chalk.green(`INFO: Got ${response.length} fines.`));
    res.json({ fines: response });
  });
});

app.post("/fines/payAll", (req, res) => {
  console.log(chalk.blue("INFO: Paying all fines..."));
  console.log(chalk.blue(JSON.stringify(req.body)));
  const cardNumber = req.body.Card_no;

  const allBookLoansWithCardNumber = `SELECT * from book_loan NATURAL JOIN fines WHERE Date_in = '' AND Card_id = ${cardNumber} AND Fine_amt > 0;`;
  const allLoans = `SELECT * FROM fines NATURAL JOIN book_loan WHERE Card_id = ${cardNumber} AND Fine_amt > 0;`;

  const allPromises = [];

  tryWithMessage(allBookLoansWithCardNumber, res).then(response => {
    if (response.length > 0) {
      res.json({
        message:
          "You still have books checked out. Please return all your books before paying your fines."
      });
    } else {
      tryWithMessage(allLoans, res).then(response => {
        response.forEach(loan => {
          const setPaid = `UPDATE fines SET Paid = 1 WHERE Loan_id = ${loan.Loan_id};`;

          allPromises.push(tryWithMessage(setPaid, res));

          if (allPromises.length === response.length) {
            Promise.all(allPromises)
              .then(response => {
                res.json({ message: "Paid off all fines!" });
                console.log(
                  chalk.green(`Paid off all fines for card id: ${cardNumber}`)
                );
              })
              .catch(error => {
                res.json({ message: `Error paying fines: ` + error });
                console.error(chalk.red(`Error paying fines: ` + error));
              });
          }
        });

        if (response.length === 0)
          res.json({
            message:
              "You have no fines to pay. If this is incorrect, update the fines and try again."
          });
      });
    }
  });
});

app.get("/loans/get/:card_id", (req, res) => {
  const cardNumber = req.params.card_id;
  console.info(chalk.blue("INFO: Searching for card number " + cardNumber));

  const allBookLoansWithCardNumber = `SELECT * FROM book_loan, book WHERE Date_in = '' AND Card_id = ${cardNumber} AND book.Isbn = book_loan.Isbn;`;

  tryWithMessage(allBookLoansWithCardNumber, res).then(response => {
    console.log(
      chalk.blue(
        "INFO: Found " +
          response.length +
          " loans for card id " +
          cardNumber +
          "."
      )
    );
    res.json({ loans: response });
  });
});

app.get("/loans/allLoans", (req, res) => {
  const allBookLoansWithCardNumber = `SELECT * FROM book_loan WHERE Date_in = '';`;

  tryWithMessage(allBookLoansWithCardNumber, res).then(response => {
    res.json({ loans: response });
  });
});

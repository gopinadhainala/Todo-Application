const express = require("express");
const instanceOfExpress = express();
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const { format } = require("date-fns");
instanceOfExpress.use(express.json());

let database;
const dbPath = path.join(__dirname, "todoApplication.db");

const connectDbAndStartServer = async () => {
  try {
    database = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    instanceOfExpress.listen(3000, (request, response) => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (error) {
    console.log(`Db Error ${error.message}`);
  }
};
connectDbAndStartServer();

// Result Object
const convertDbObjToResponseObj = (DBobject) => {
  return {
    id: DBobject.id,
    todo: DBobject.todo,
    priority: DBobject.priority,
    status: DBobject.status,
    category: DBobject.category,
    dueDate: format(new Date(2021, 1, 21), "yyyy-MM-dd"),
  };
};

//has Status undefined
const hasStatusUndefined = (requestQuery) => {
  return requestQuery.status === "" || requestQuery.constructor === Object;
};
//has priority Undefined
const hasPriorityUndefined = (requestQuery) => {
  return requestQuery.priority === "";
};

//has category Undefined
const hasCategoryUndefined = (requestQuery) => {
  return requestQuery.category === "";
};
//has due date undefined
const hasDueDateUndefined = (requestQuery) => {
  return requestQuery.dueDate === "";
};

// has status
const hasStatus = (requestQuery) => {
  return requestQuery.status !== undefined;
};

//has status and Priority
const hasStatusAndPriority = (requestQuery) => {
  return (
    requestQuery.status !== undefined && requestQuery.priority !== undefined
  );
};
//has status and category
const hasStatusAndCategory = (requestQuery) => {
  return (
    requestQuery.status !== undefined && requestQuery.category !== undefined
  );
};
//has priority
const hasPriority = (requestQuery) => {
  return requestQuery.priority !== undefined;
};
//has priority and category
const hasPriorityAndCategory = (requestQuery) => {
  return (
    requestQuery.priority !== undefined && requestQuery.category !== undefined
  );
};

// has search_q
const hasSearch = (requestQuery) => {
  return requestQuery.search_q !== undefined;
};
//has category
const hasCategory = (requestQuery) => {
  return requestQuery.category !== undefined;
};

instanceOfExpress.get("/todos/", async (request, response) => {
  const { priority, category, status, dueDate, search_q } = request.query;
  let invalidText;
  let selectQuery;
  let data;
  switch (true) {
    case hasStatusUndefined(request.query):
      invalidText = "Invalid Todo Status";
      break;
    case hasPriorityUndefined(request.query):
      invalidText = "Invalid Todo Priority";
      break;
    case hasCategoryUndefined(request.query):
      invalidText = "Invalid Todo Category";
      break;
    case hasDueDateUndefined(request.query):
      invalidText = "Invalid Due Date";
      break;
    case hasStatus(request.query):
      //s1
      selectQuery = `SELECT * FROM todo Where status like "%${status}%";`;
      break;
    case hasStatusAndPriority(request.query):
      //s3
      selectQuery = `SELECT * FROM todo Where priority = "${priority}" AND status like "%${status}%";`;
      break;
    case hasStatusAndCategory(request.query):
      //s5
      selectQuery = `SELECT * FROM todo Where status like "%${status}% and category like "%${category}%";`;
      break;
    case hasPriority(request.query):
      //s2
      selectQuery = `SELECT * FROM todo Where priority like "%${priority}%";`;
      break;
    case hasPriorityAndCategory(request.query):
      //s7
      selectQuery = `SELECT * FROM todo Where priority = "${priority}" AND category = "${category}";`;
      break;
    case hasSearch(request.query):
      //S4
      selectQuery = `SELECT * FROM todo Where todo like "%${search_q}%";`;
      break;
    case hasCategory(request.query):
      //s6
      selectQuery = `SELECT * FROM todo Where category = "${category}";`;
      break;
  }
  console.log(invalidText);
  if (invalidText === undefined) {
    console.log("Query");
  } else {
    console.log("Error");
  }
});

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../lib/firebase";

const PERMISSION_DENIED_MESSAGE =
  "Accès refusé. Vous n'avez pas la permission d'effectuer cette action.";

const formatServiceError = (error, fallbackMessage) => {
  const code = error?.code || "";

  if (code === "permission-denied" || code === "firestore/permission-denied") {
    return new Error(PERMISSION_DENIED_MESSAGE);
  }

  return new Error(`${fallbackMessage}: ${error?.message || "unknown error"}.`);
};

const getTasksCollectionRef = (userId) => {
  if (!userId) {
    throw new Error("User ID is required to access tasks.");
  }

  return collection(db, "users", userId, "tasks");
};

export const getUserTasks = async (userId) => {
  try {
    const tasksRef = getTasksCollectionRef(userId);
    const tasksQuery = query(tasksRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(tasksQuery);

    return snapshot.docs.map((taskDoc) => {
      const data = taskDoc.data();

      return {
        id: taskDoc.id,
        title: data.title ?? "",
        completed: data.completed ?? false,
        priority: data.priority ?? "medium",
        createdAt: data.createdAt ?? null,
      };
    });
  } catch (error) {
    throw formatServiceError(error, "Failed to fetch user tasks");
  }
};

export const addTask = async (userId, task) => {
  try {
    const tasksRef = getTasksCollectionRef(userId);
    const taskData = {
      title: task?.title ?? "",
      completed: false,
      priority: task?.priority ?? "medium",
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(tasksRef, taskData);
    return docRef.id;
  } catch (error) {
    throw formatServiceError(error, "Failed to add task");
  }
};

export const updateTask = async (userId, taskId, updates) => {
  try {
    if (!taskId) {
      throw new Error("Task ID is required to update a task.");
    }

    const taskRef = doc(db, "users", userId, "tasks", taskId);
    await updateDoc(taskRef, updates);
  } catch (error) {
    throw formatServiceError(error, "Failed to update task");
  }
};

export const deleteTask = async (userId, taskId) => {
  try {
    if (!taskId) {
      throw new Error("Task ID is required to delete a task.");
    }

    const taskRef = doc(db, "users", userId, "tasks", taskId);
    await deleteDoc(taskRef);
  } catch (error) {
    throw formatServiceError(error, "Failed to delete task");
  }
};

export const subscribeToTasks = (userId, callback, onError) => {
  try {
    if (typeof callback !== "function") {
      throw new Error("A valid callback function is required.");
    }

    const tasksRef = getTasksCollectionRef(userId);
    const tasksQuery = query(tasksRef, orderBy("createdAt", "desc"));

    return onSnapshot(
      tasksQuery,
      (snapshot) => {
        const tasks = snapshot.docs.map((taskDoc) => {
          const data = taskDoc.data();

          return {
            id: taskDoc.id,
            title: data.title ?? "",
            completed: data.completed ?? false,
            priority: data.priority ?? "medium",
            createdAt: data.createdAt ?? null,
          };
        });

        callback(tasks);
      },
      (error) => {
        const subscriptionError = formatServiceError(
          error,
          "Real-time task subscription failed"
        );
        if (typeof onError === "function") {
          onError(subscriptionError);
          return;
        }
        console.error(subscriptionError.message);
      }
    );
  } catch (error) {
    throw formatServiceError(error, "Failed to subscribe to tasks");
  }
};

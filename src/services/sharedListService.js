import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";

const sharedListsCollection = collection(db, "sharedLists");

const mapSharedList = (listDoc) => {
  const data = listDoc.data();

  return {
    id: listDoc.id,
    name: data.name ?? "",
    ownerId: data.ownerId ?? "",
    members: data.members ?? [],
    createdAt: data.createdAt ?? null,
  };
};

const getTimestampMillis = (value) => {
  if (!value) return 0;
  if (typeof value.toMillis === "function") return value.toMillis();
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
};

const sortSharedListsByCreatedAtDesc = (lists) =>
  [...lists].sort(
    (a, b) => getTimestampMillis(b.createdAt) - getTimestampMillis(a.createdAt)
  );

const mapSharedTask = (taskDoc) => {
  const data = taskDoc.data();

  return {
    id: taskDoc.id,
    title: data.title ?? "",
    completed: data.completed ?? false,
    priority: data.priority ?? "medium",
    createdAt: data.createdAt ?? null,
    addedBy: data.addedBy ?? null,
  };
};

const getSharedListRef = (listId) => {
  if (!listId) {
    throw new Error("List ID is required.");
  }

  return doc(db, "sharedLists", listId);
};

const getSharedTasksCollectionRef = (listId) => {
  if (!listId) {
    throw new Error("List ID is required to access shared tasks.");
  }

  return collection(db, "sharedLists", listId, "tasks");
};

const getSharedListById = async (listId) => {
  const listRef = getSharedListRef(listId);
  const listSnapshot = await getDoc(listRef);

  if (!listSnapshot.exists()) {
    throw new Error("Shared list not found.");
  }

  return {
    ref: listRef,
    data: listSnapshot.data(),
  };
};

const findUserByEmail = async (email) => {
  const normalizedEmail = email.trim().toLowerCase();

  const normalizedEmailQuery = query(
    collection(db, "users"),
    where("emailLowercase", "==", normalizedEmail),
    limit(1)
  );
  const normalizedSnapshot = await getDocs(normalizedEmailQuery);

  if (!normalizedSnapshot.empty) {
    return normalizedSnapshot.docs[0];
  }

  const rawEmailQuery = query(
    collection(db, "users"),
    where("email", "==", email.trim()),
    limit(1)
  );
  const rawSnapshot = await getDocs(rawEmailQuery);

  if (!rawSnapshot.empty) {
    return rawSnapshot.docs[0];
  }

  return null;
};

export const createSharedList = async (userId, name) => {
  try {
    if (!userId) {
      throw new Error("User ID is required to create a shared list.");
    }
    if (!name?.trim()) {
      throw new Error("List name is required.");
    }

    const docRef = await addDoc(sharedListsCollection, {
      name: name.trim(),
      ownerId: userId,
      members: [userId],
      createdAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    throw new Error(
      `Failed to create shared list: ${error.message || "unknown error"}.`
    );
  }
};

export const getUserSharedLists = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required to fetch shared lists.");
    }

    const listsQuery = query(
      sharedListsCollection,
      where("members", "array-contains", userId)
    );
    const snapshot = await getDocs(listsQuery);

    return sortSharedListsByCreatedAtDesc(snapshot.docs.map(mapSharedList));
  } catch (error) {
    throw new Error(
      `Failed to fetch shared lists: ${error.message || "unknown error"}.`
    );
  }
};

export const subscribeToSharedLists = (userId, callback) => {
  try {
    if (!userId) {
      throw new Error("User ID is required to subscribe to shared lists.");
    }
    if (typeof callback !== "function") {
      throw new Error("A valid callback function is required.");
    }

    const listsQuery = query(
      sharedListsCollection,
      where("members", "array-contains", userId)
    );

    return onSnapshot(
      listsQuery,
      (snapshot) => {
        callback(sortSharedListsByCreatedAtDesc(snapshot.docs.map(mapSharedList)));
      },
      (snapshotError) => {
        console.error(
          `Shared lists subscription failed: ${
            snapshotError.message || "unknown error"
          }.`
        );
      }
    );
  } catch (error) {
    throw new Error(
      `Failed to subscribe to shared lists: ${error.message || "unknown error"}.`
    );
  }
};

export const addMemberToList = async (listId, email) => {
  try {
    if (!email?.trim()) {
      throw new Error("Member email is required.");
    }

    const userDoc = await findUserByEmail(email);
    if (!userDoc) {
      throw new Error("No user found with this email.");
    }

    const memberId = userDoc.id;
    const listRef = getSharedListRef(listId);
    await updateDoc(listRef, {
      members: arrayUnion(memberId),
    });
  } catch (error) {
    throw new Error(
      `Failed to add member: ${error.message || "unknown error"}.`
    );
  }
};

export const removeMemberFromList = async (listId, userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required to remove a member.");
    }

    const { ref: listRef, data: listData } = await getSharedListById(listId);
    const currentUserId = auth.currentUser?.uid;

    if (!currentUserId || currentUserId !== listData.ownerId) {
      throw new Error("Only the list owner can remove members.");
    }

    await updateDoc(listRef, {
      members: arrayRemove(userId),
    });
  } catch (error) {
    throw new Error(
      `Failed to remove member: ${error.message || "unknown error"}.`
    );
  }
};

export const deleteSharedList = async (listId, userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required to delete a shared list.");
    }

    const { ref: listRef, data: listData } = await getSharedListById(listId);

    if (listData.ownerId !== userId) {
      throw new Error("Only the list owner can delete this shared list.");
    }

    const tasksRef = getSharedTasksCollectionRef(listId);
    const tasksSnapshot = await getDocs(tasksRef);

    await Promise.all(tasksSnapshot.docs.map((taskDoc) => deleteDoc(taskDoc.ref)));
    await deleteDoc(listRef);
  } catch (error) {
    throw new Error(
      `Failed to delete shared list: ${error.message || "unknown error"}.`
    );
  }
};

export const getSharedListTasks = async (listId) => {
  try {
    const tasksRef = getSharedTasksCollectionRef(listId);
    const tasksQuery = query(tasksRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(tasksQuery);

    return snapshot.docs.map(mapSharedTask);
  } catch (error) {
    throw new Error(
      `Failed to fetch shared tasks: ${error.message || "unknown error"}.`
    );
  }
};

export const addSharedTask = async (listId, userId, task) => {
  try {
    if (!userId) {
      throw new Error("User ID is required to add a shared task.");
    }
    if (!task?.title?.trim()) {
      throw new Error("Task title is required.");
    }

    const tasksRef = getSharedTasksCollectionRef(listId);
    const docRef = await addDoc(tasksRef, {
      title: task.title.trim(),
      completed: task.completed ?? false,
      priority: task.priority ?? "medium",
      createdAt: serverTimestamp(),
      addedBy: userId,
    });

    return docRef.id;
  } catch (error) {
    throw new Error(
      `Failed to add shared task: ${error.message || "unknown error"}.`
    );
  }
};

export const updateSharedTask = async (listId, taskId, updates) => {
  try {
    if (!taskId) {
      throw new Error("Task ID is required to update a shared task.");
    }

    const taskRef = doc(db, "sharedLists", listId, "tasks", taskId);
    await updateDoc(taskRef, updates);
  } catch (error) {
    throw new Error(
      `Failed to update shared task: ${error.message || "unknown error"}.`
    );
  }
};

export const deleteSharedTask = async (listId, taskId) => {
  try {
    if (!taskId) {
      throw new Error("Task ID is required to delete a shared task.");
    }

    const taskRef = doc(db, "sharedLists", listId, "tasks", taskId);
    await deleteDoc(taskRef);
  } catch (error) {
    throw new Error(
      `Failed to delete shared task: ${error.message || "unknown error"}.`
    );
  }
};

export const subscribeToSharedTasks = (listId, callback) => {
  try {
    if (typeof callback !== "function") {
      throw new Error("A valid callback function is required.");
    }

    const tasksRef = getSharedTasksCollectionRef(listId);
    const tasksQuery = query(tasksRef, orderBy("createdAt", "desc"));

    return onSnapshot(
      tasksQuery,
      (snapshot) => {
        callback(snapshot.docs.map(mapSharedTask));
      },
      (snapshotError) => {
        console.error(
          `Shared tasks subscription failed: ${
            snapshotError.message || "unknown error"
          }.`
        );
      }
    );
  } catch (error) {
    throw new Error(
      `Failed to subscribe to shared tasks: ${error.message || "unknown error"}.`
    );
  }
};

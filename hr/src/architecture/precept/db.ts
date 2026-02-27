export const openDB = (dbName: string, storeNames: Array<string>, version: number = 1) => {
  return new Promise((resolve: any, reject: any) => {
    const indexedDB = window.indexedDB;
    let db: any = null;
    const request = indexedDB.open(dbName, version);
    request.onsuccess = (event: any) => {
      db = (event.target as any).result || null;
      resolve(db)
    }
    request.onerror = (event: any) => {
      reject(event)
    }
    request.onupgradeneeded = (event: any) => {
      db = event.target.result;
      if (event.oldVersion < event.newVersion) {
        storeNames.forEach(sn => {
          db.objectStoreNames.contains(sn) && db.deleteObjectStore(sn);
        })
      }
      storeNames.forEach(sn => {
        let objectStore: any = null;
        if (!db.objectStoreNames.contains(sn)) {
          objectStore = db.createObjectStore(sn, { keyPath: 'id' });
          if (['user_message_table', 'user_message_table_error'].includes(sn)) {
            // 为 'userId' 字段创建索引
            objectStore.createIndex('userId', 'userId', { unique: false });
          }
        }
      })
    }
  })
};

export const addData = (db: any, storeName: any, data: any, key: string = 'id') => {
  return new Promise((resolve, reject) => {
    const request = db.transaction([storeName], 'readwrite').objectStore(storeName).add(data);

    request.onsuccess = () => {
      getData(db, storeName, data[key]).then((res: any) => {
        resolve({ code: 200, data: res.data });
      }).catch((err: any) => {
        reject({ code: 0, data: err, msg: '获取数据失败!' });
      });
    }

    request.onerror = (event: any) => {
      reject({ code: 0, data: event, msg: '添加数据失败!' });
      throw new Error(event.target.error);
    }
  })
};

export const getData = (db: any, storeName: any, key: any) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName]);
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.get(key)

    request.onerror = (event: any) => {
      reject({ code: 0, data: event, msg: '获取数据失败!' });
    }

    request.onsuccess = () => {
      resolve({ code: 200, data: request.result || null });
    }
  })
};

export const updateData = (db: any, storeName: any, data: any, key: string = 'id') => {
  const request = db.transaction([storeName], 'readwrite').objectStore(storeName).put(data);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      resolve({ code: 200, data: data });
    }

    request.onerror = (e: any) => {
      reject({ code: 0, data: e, msg: '更新数据失败!' });
    }
  })
};


export const deleteDate = (db: any, storeName: any, id: any) => {
  const request = db.transaction([storeName], 'readwrite').objectStore(storeName).delete(id)

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      resolve({ code: 200, msg: '删除数据成功!' });
    }

    request.onerror = (ev: any) => {
      reject({ code: 0, data: ev, msg: '删除数据失败!' });
    }
  })
};


export const deleteDBAll = (db: any, dbName: string) => {
  db.close();
  const deleteRequest = window.indexedDB.deleteDatabase(dbName)
  return new Promise((resolve, reject) => {
    deleteRequest.onerror = (event: any) => {
      reject({ code: 0, data: event, msg: '删除数据失败!' });
    }
    deleteRequest.onsuccess = () => {
      resolve({ code: 200, msg: '删除成功!' });
    }
  })
};


export const closeDB = async (db: any, call: Function) => {
  await db.close();
  call();
};


export const cursorGetData = (db: any, storeName: any) => {
  const list: Array<any> = []
  const store = db.transaction(storeName, 'readwrite').objectStore(storeName)
  const request = store.openCursor()
  return new Promise((resolve, reject) => {
    request.onsuccess = (e: any) => {
      const cursor = e.target.result
      if (cursor) {
        list.push(cursor.value)
        cursor.continue()
      } else {
        resolve({ code: 200, data: list })
      }
    }
    request.onerror = (e: any) => {
      reject({ code: 0, data: e, msg: '获取数据失败!' })
    }
  })
};


export const getDataByIndex = (db: any, storeName: any, indexName: string, indexValue: any) => {
  const store = db.transaction(storeName, 'readwrite').objectStore(storeName)
  const request = store.index(indexName).get(indexValue)
  return new Promise((resolve, reject) => {
    request.onerror = (e: any) => {
      reject({ code: 0, data: e, msg: '获取数据失败!' })
    }
    request.onsuccess = (e: any) => {
      resolve({ code: 200, data: e.target.result })
    }
  })
};

export const cursorGetDataByIndex = (db: any, storeName: any, indexName: string, indexValue: any) => {
  const list: Array<any> = []
  const store = db.transaction(storeName, 'readwrite').objectStore(storeName)
  const request = store.index(indexName).openCursor(IDBKeyRange.only(indexValue))
  return new Promise((resolve, reject) => {
    request.onsuccess = (e: any) => {
      const cursor = e.target.result
      if (cursor) {
        list.push(cursor.value)
        cursor.continue()
      } else {
        resolve({ code: 200, data: list })
      }
    }
    request.onerror = (ev: any) => {
      reject({ code: 0, data: ev, msg: '获取数据失败!' })
    }
  })
};
//表格清除
export const clearTableValue = (db: any, storeName: any) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readwrite");
    transaction.oncomplete = () => {

    };
    transaction.onerror = (ev) => {
      reject({ code: 0, data: ev, msg: '事务创建失败!' })
    };

    const objectStore = transaction.objectStore(storeName);
    const objectStoreRequest = objectStore.clear();

    objectStoreRequest.onsuccess = () => {
      resolve({ code: 200, data: '' })
    };

  })
}

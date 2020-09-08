import React, {useState, useEffect} from 'react';
import Axios from "axios";

import {Nav} from './components/Nav';
import {download, formatChains, findNextPage} from './utils/functions';
import {Table} from './components/Table';
import {Controls} from './components/Controls';
import {Form} from './components/Form';
import {Samples} from './components/Samples';

import './App.css';
import 'materialize-css';

function App() {
  const [text, setText] = useState('')
  const [pages, setPages] = useState([])
  const [finish, setFinish] = useState(false)
  const [start, setStart] = useState(false)

  const onChangeText = (e) => {
    setText(e.target.value)
    const urls = e.target.value.trim().split("\n");
    const userPages = urls.map((item, index) => {
      return {
        id: index,
        url: item.replace(/\s*/,''),
        checking: false,
        code: null,
        multyRedirect: false,
        verified: false
      };
    });
    setPages(userPages);
  };

  /*
   * Выставляем признак проверки у адреса
   */
  const setCheckingStatus = (url) => {
      const newPages = pages.map(item => {
          if (item.url === url) {
              item.checking = true
          }
          return item
      });
      setPages(newPages);
  };

  /*
   * Проверяем 1 адрес
   */
  const checkOne = async (nextPage) => {
    setCheckingStatus(nextPage.url);
    await Axios.post(`/responser/?timestamp=${new Date().getTime()}`, {
          url: nextPage.url
        })
        .then(res => {
            const newPagesLoad = pages.map(item => {
                if (item.url === nextPage.url) {
                    item.checking = false;
                    item.verified = true;
                    item.code = res.data.code;
                    item.last_code = res.data.last_code;
                    item.multyRedirect = !!res.data.info.redirect_count;
                    item.chains = res.data.chains || [];
                }
                return item;
            });
            setPages(newPagesLoad);
        })
        .catch(error => {
            console.log('Axios error', error);
        });
  };

  const run = () => {
      setStart(true);
      check();
  };

  const check = async () => {
      const nextPage = findNextPage(pages);
      if (!nextPage) {
        setFinish(true);
        return null;
      }
      await checkOne(nextPage);
      check();
  };

  const reinit = () => {
      setText('');
      setPages([]);
      setStart(false);
      setFinish(false);
  };

  return (
      <>
        <div className="header">
          <Nav />
        </div>
        <div className="container">
          <h4>Responser</h4>
          <blockquote>
            Проверяем отклики страниц. Вы можете загрузить список страниц для массовой проверки<br />
            Каждый адрес должен начинаться с новой строки
          </blockquote>
          
          <div className="row">
            <Form
                onChangeHandler={onChangeText}
                start={start}
                text={text}
            />
          </div>

          {pages && pages.length > 0 && (
              <div>
                  <Controls
                      pages={pages}
                      start={start}
                      finish={finish}
                      onRun={run}
                      onReinit={reinit}
                      onDownload={download}
                  />
                  <Table pages={pages} />
              </div>
          )}

          <Samples />

        </div>
      </>
  );
}

export default App;

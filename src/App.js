import React, {useState, useEffect} from 'react';
import {Nav} from './components/Nav';
import PreloaderCell from "./components/PreloaderCell";
import './App.css';
import 'materialize-css';
import Axios from "axios";


const initialState = [];

function App() {
  const [pages, setPages] = useState(initialState)
  const [finish, setFinish] = useState(false)

  const onChangeHandler = (e) => {
    const urls = e.target.value.trim().split("\n");
    const userPages = urls.map((item, index) => {
      return {
        id: index,
        url: item.replace(/\s*/,''),
        checking: false,
        code: null,
        multyRedirect: false,
        verified: false
      }
    })
    setPages(userPages);
  }

  const findNextPage = () => {
    const nextPage = pages.find(item => {
      if (item.verified == false) {
        return item
      }
      return null
    })
    return nextPage
  }

  const checkOne = async (nextPage) => {
    //Ставим метку загрузки
    const newPages = pages.map(item => {
      if (item.url === nextPage.url) {
        item.checking = true
      }
      return item
    })
    setPages(newPages)

    //отправляем запрос
    Axios.post(`/responser/?timestamp=${new Date().getTime()}`, {
      url: nextPage.url
    })
        .then(res => {
          const newPagesLoad = pages.map(item => {
            if (item.url === nextPage.url) {
              item.checking = false
              item.verified = true
              item.code = res.data.info.http_code
            }
            return item
          })
          setPages(newPagesLoad)
        })
        .catch(error => {
          console.log('Axios error', error);
        })
  }

  const check = async () => {
    //while (true) {
    console.log('start');
      const nextPage = findNextPage();
      if (!nextPage) {
        setFinish(true)
        return
      }
      await checkOne(nextPage);
      console.log('stop');
    //}
  }

  useEffect(() => {
    console.log('state', pages);
  }, [pages])

      //console.log('state', pages);

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
            <form className="col s12">
              <div className="row">
                <div className="input-field col s6">
                  <i className="material-icons prefix">mode_edit</i>
                  <textarea
                      id="icon_prefix2"
                      className="materialize-textarea"
                      onChange={(e) => onChangeHandler(e)}
                  ></textarea>
                  <label htmlFor="icon_prefix2">Список страниц</label>
                </div>
              </div>
            </form>
          </div>

          {pages && pages.length > 0 && (
              <div>
                <div className="responser-controls">
                  <button
                      className="waves-effect waves-light btn"
                      onClick={() => check()}
                  >
                    <i className="material-icons left">play_arrow</i>
                    Начать проверку
                  </button>
                </div>
                <table>
                  <thead>
                  <tr>
                    <th>##</th>
                    <th>Адрес страницы</th>
                    <th>Код ответа</th>
                    <th>Множественный редирект</th>
                  </tr>
                  </thead>
                  <tbody>
                  {pages.map((item, index) => {
                    return (
                        <tr key={item.url}>
                          <td>{index+1}</td>
                          <td>{item.url}</td>
                          <td>
                            {item.checking && !item.verified &&
                                <PreloaderCell />
                            }
                            {!item.checking && item.verified &&
                                <span className="new badge" data-badge-caption="">{item.code}</span>
                            }
                            </td>
                          <td>{item.multiRedirect}</td>
                        </tr>
                    );
                  })}
                  </tbody>
                </table>
              </div>
          )}



        </div>
      </>
  );
}

export default App;

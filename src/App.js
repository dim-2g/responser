import React, {useState, useEffect} from 'react';
import {Nav} from './components/Nav';
import PreloaderCell from "./components/PreloaderCell";
import Axios from "axios";
import classNames from 'classnames' 
import Parser from "html-react-parser";
import './App.css';
import 'materialize-css';



const initialState = [];

function App() {
  const [text, setText] = useState('')
  const [pages, setPages] = useState(initialState)
  const [finish, setFinish] = useState(false)
  const [start, setStart] = useState(false)

  const onChangeHandler = (e) => {
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
      }
    })
    setPages(userPages);
  }

  const findNextPage = () => pages.find(item => item.verified === false ? item : null)

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
    await Axios.post(`/responser/?timestamp=${new Date().getTime()}`, {
          url: nextPage.url
        })
        .then(res => {
          const newPagesLoad = pages.map(item => {
            if (item.url === nextPage.url) {
              item.checking = false
              item.verified = true
              item.code = res.data.code
              item.multyRedirect = !!res.data.info.redirect_count
              item.chains = res.data.chains || []
            }
            return item
          })
          setPages(newPagesLoad)
        })
        .catch(error => {
          console.log('Axios error', error);
        })
  }

  const run = () => {
    setStart(true)
    check()
  }

  const check = async () => {
      const nextPage = findNextPage();
      if (!nextPage) {
        setFinish(true)
        return null
      }
      await checkOne(nextPage);
      check();
  }

  const reinit = () => {
    setText('')
    setPages(initialState)
    setStart(false)
    setFinish(false)
  }

  useEffect(() => {
    console.log('state', pages);
  }, [pages])

      //console.log('state', pages);
  const formatChains = (chains) => {
      const result = chains.map(chain => {
          return `${chain.http_code} : ${chain.location}`
      })
      return result.join("<br />")
  }

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
                      disabled={start}
                      value={text}
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
                        onClick={() => run()}
                        disabled={start}
                    >
                      <i className="material-icons left">play_arrow</i>
                      Начать проверку
                    </button>
                    {finish && 
                      <button
                          className="waves-effect waves-light btn red lighten-2"
                          onClick={() => reinit()}
                      >
                        <i className="material-icons left">autorenew</i>
                        Новая проверка
                      </button>
                    }
                </div>
                <table>
                  <thead>
                  <tr>
                    <th>##</th>
                    <th>Адрес страницы</th>
                    <th>Код ответа</th>
                    <th width="400">Множественный редирект</th>
                  </tr>
                  </thead>
                  <tbody>
                  {pages.map((item, index) => {
                    const badgeClass = classNames(
                      'new',
                      'badge',
                      {'orange': item.code === 301},
                      {'red': item.code === 404}
                    )
                    return (
                        <tr key={item.url}>
                          <td>{index+1}</td>
                          <td>{item.url}</td>
                          <td className="centered">
                            {item.checking && !item.verified &&
                                <PreloaderCell />
                            }
                            {!item.checking && item.verified &&
                                <span className={badgeClass} data-badge-caption="">{item.code}</span>
                            }
                            </td>
                          <td>
                            <small>
                                {item.chains && 
                                  Parser(formatChains(item.chains))
                                }
                            </small>
                          </td>
                        </tr>
                    );
                  })}
                  </tbody>
                </table>
              </div>
          )}


          <div>
              https://www.yournail.ru/<br />
              http://yournail.ru/manikyur/na-novyij-god/<br />
              https://www.yournail.ru/manikyur/k-23-fevralya/<br />
          </div>


        </div>
      </>
  );
}

export default App;

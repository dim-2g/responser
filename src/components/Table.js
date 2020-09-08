import React from "react";
import classNames from "classnames";
import PreloaderCell from "./PreloaderCell";
import Parser from "html-react-parser";
import {formatChains} from "../utils/functions";

export const Table = (props) => {
    const {pages} = props;
    return (
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
                );
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
    );
};
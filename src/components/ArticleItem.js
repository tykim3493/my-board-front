import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots, faImage } from "@fortawesome/free-solid-svg-icons";

const ArticleItem = ({
  article,
  adminCol,
  setCheckedIds,
  name,
}) => {

  // 체크박스 클릭시
  const checkArticles = () => {
    if (article.isChecked === false) {
      setCheckedIds((prevCheckedIds) => [
        ...prevCheckedIds,
        article.id,
      ]);
      article.isChecked = true;
    } else {
      setCheckedIds((prevCheckedIds) =>
        prevCheckedIds.filter((id) => id !== article.id)
      );
      article.isChecked = false;
    } 
  }
    
  return (
    <li className={article.isNotice 
      ? "flex p-5 bg-white border-t border-gray-400 border-dotted bg-yellow-100"
      : "flex p-5 bg-white border-t border-gray-400 border-dotted hover:bg-yellow-100/25"
    }>
      <div className="flex w-12 justify-center items-center" style={{ display: adminCol ? 'none' : '' }}>
        {name === article.writer
          ? (
            <input
              type="checkbox"
              className="w-4 h-4"
              onChange={checkArticles}
              checked={article.isChecked}
            />
          ): (
            null
          )
        }
      </div>
      <div className="w-12 text-center">
        <span className="text-md text-gray-600">
          {article.id}
        </span>
      </div>
      <div className="w-20 text-center">
        {article.categoryId === "1"
          ? (
            <span className="rounded-full border border-sky-100 bg-sky-50 px-2 py-0.5 text-sky-400">
              {article.categoryName}
            </span>
          )
          : <span className="rounded-full border border-pink-100 bg-pink-50 px-2 py-0.5 text-pink-400">
              {article.categoryName}
            </span> 
        }
      </div>
      <div className="flex-1 ml-10">
        <span className={article.isNotice 
          ? "text-md font-bold hover:cursor-pointer"
          : "text-md hover:font-bold hover:cursor-pointer"}
          onClick={() => window.location.href = `/view/${article.id}`}
        >{article.title}</span>
          {article.commentCount
            ? <>
                <span className="ml-3 text-xs text-blue-300">
                <FontAwesomeIcon icon={faCommentDots} className="mr-1" />
                  {article.commentCount}
                </span>
              </>
            : null}
          {article.fileCount
            ? <>
                <span className="ml-3 text-xs text-pink-300">
                <FontAwesomeIcon icon={faImage} className="mr-1" />
                  {article.fileCount}
                </span>
              </>
            : null}
        {(new Date() - article.date) < 24 * 60 * 60 * 1000 && (
          <span className="ml-3 text-xs font-bold text-red-400">NEW</span>
        )}
      </div>
      <div className="w-24 text-center">
        <span className="text-md">{article.writer}</span>
      </div>
      <div className="w-32 text-center">
        <span className="text-sm">
          {new Date(article.createdAt).toLocaleDateString('ko-KR')}
        </span>
      </div>
      <div className="w-32 text-center">
        <span className="text-sm">
          {article.updatedAt 
          ? new Date(article.updatedAt).toLocaleDateString('ko-KR') 
          : ""}
        </span>
      </div>
    </li>
  );
};

export default ArticleItem;
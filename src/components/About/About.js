import React, { useState, useEffect } from 'react';
import styles from './About.module.css';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Octokit } from '@octokit/rest';
import location from './img/location.png';
import ReactPaginate from 'react-paginate';

const octokit = new Octokit();

const About = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [repoList, setRepoList] = useState([]);
    const [requestFailed, setRequestFailed] = useState(false);
    const [error, setError] = useState('');
    const [userInfo, setUserInfo] = useState({});
    const [pageNumber, setPageNumber] = useState(0);

    useEffect(() => {
      octokit.repos.listForUser({
          username: 'tinkabel85'
        })
        .then(response => {
          console.log(response.data[2].language);
          setRepoList(response.data);
          setIsLoading(false);
        })
        .catch(err => {
          console.log(err)
          setRequestFailed(true);
          setIsLoading(false);
          setError('Something went wrong...');
        });

      octokit.users.getByUsername({
          username: 'tinkabel85'
        })
        .then(response => {
          console.log(response.data);
          setUserInfo(response.data);
          setIsLoading(false);
        })
        .catch(err => {
          setRequestFailed(true);
          setIsLoading(false);
          setError('Something went wrong...');
        })

    }, []);



const reposPerPage = 4;
const reposSeen = pageNumber * reposPerPage;
const displayRepos = repoList.slice(reposSeen, reposSeen + reposPerPage);
const pageCount = Math.ceil(repoList.length / reposPerPage);
const changePage = ({selected}) => {
    setPageNumber(selected)
}


    return (
      <CardContent>
        <div className={styles.wrap}>
          { isLoading ?  <CircularProgress /> :
            <div>
          {!isLoading &&
            <div>
              {!requestFailed  && <div className={styles.header}>
                    <img className={styles.avatar} src={userInfo.avatar_url} alt={userInfo.name} />
                    <div className={styles.info}>
                      <h1 className={styles.info_name}>{userInfo.name}</h1>
                      <img className={styles.location} src={ location } alt='location'></img>
                      <p className={styles.info_city}> {userInfo.location}</p>
                      <p className={styles.info_bio}> {userInfo.bio}</p>
                      <a className={styles.link} href={userInfo.html_url}>Здесь ссылка на GitHub</a>
                    </div>
              </div> }
            <ul>
                  {displayRepos.map(repo => (<li key={repo.id} className={styles.repos}>
                    <div className={styles.repos_name}><a href={repo.html_url} target='blank' className = {styles.repos_link}>
                    {repo.name} </a> </div>
                    <div className={styles.repos__info}>
                    <div className= {styles.lang}>
                      <div className={[styles.circle, styles[repo.language]].join(' ')}></div>
                    <p className = {styles.repos_lang}> {repo.language}</p>
                    </div>
                    <p className = {styles.repos_date}> Updated on { new Date( repo.updated_at).toDateString()} </p>
                    </div>
                  </li>))}
            </ul>
            <ReactPaginate
                previousLabel = {'Previous'}
                nextLabel = {'Next'}
                pageCount = {pageCount}
                onPageChange = {changePage}
                containerClassName = {styles.paginationBttns}
                previousLinkClassName = {styles.previousBttn}
                nextLinkClassName = {styles.nextBttn}
                disabledClassName = {styles.paginationDisabled}
                activeClassName = {styles.paginationActive}
            />
          </div>
        }
        </div>
      }
            {requestFailed &&  <h2 className={styles.error}> {error} </h2>}

        </div>
      </CardContent>
    );
};

export default About;

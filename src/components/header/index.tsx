import styles from './header.module.css'
import logo from '../../assets/logo.svg'
import { Link } from 'react-router-dom'

export function Header(){
    return(
        <header className={styles.container}>
            <Link to="/">
                <img src={logo} alt='logo Cript App' />
            </Link>
        </header>
    )
}

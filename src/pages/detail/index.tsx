import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

import { type CoinProps } from "../home"

import styles from './detail.module.css'

interface ResponseData {
  data: CoinProps
}

interface ErrorData { 
  error: string
}

type DataProps = ResponseData | ErrorData

export function Detail() {
  const { cripto } = useParams()

  const [coin, setCoin] = useState<CoinProps>()
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    async function getCoin(){
      try{
        fetch(`https://rest.coincap.io/v3/assets/${cripto}?apiKey=319daad120fd1b989237414728027d59061ce1b50399d80010505795c389dbfd`)
        .then(response => response.json())
        .then((data: DataProps) => {
          if("error" in data){
            navigate("/")
            return;
          }

          const definitiveData = data.data

          const price = Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
          })

          const priceCompact = Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            notation: "compact"
          })

          const resultData = {
            ...definitiveData,
          ormatedPrice: price.format(Number(definitiveData.priceUsd)),
          formatedMarket: priceCompact.format(Number(definitiveData.marketCapUsd)),
          formatedVolume: priceCompact.format(Number(definitiveData.volumeUsd24Hr))
          }

          setCoin(resultData)
          setLoading(false)
        })


      } catch(error){
        console.log(error)
        navigate("/")
      }
    }

    getCoin()
  }, [cripto])

  if(loading || !coin){
    return(
      <div className={styles.container}>
        <h4 className={styles.name}>Carregando detalhes...</h4>
      </div>
    )
  }

  return (
    <div className={styles.container}>
        <h1 className={styles.title}>{coin?.name}</h1>
        <h1 className={styles.title}>{coin?.symbol}</h1>

        <section className={styles.content}>
          <img 
            src={`https://assets.coincap.io/assets/icons/${coin?.symbol.toLowerCase()}@2x.png`}
            alt="Logo da moeda"
            className={styles.logo}
          />
          <h1 className={styles.name}>{coin?.name} | {coin?.symbol}</h1>
          <p><strong>Preço: </strong>{coin?.formatedPrice}</p>

          <a>
            <strong>Mercado: </strong>{coin?.formatedMarket}
          </a>
          <a>
            <strong>Volume: </strong>{coin?.formatedVolume}
          </a>
          <a>
            <strong>Mudança nas últimas 24H: </strong><span className={Number(coin?.changePercent24Hr) > 0 ? styles.profit : styles.loss} >
              {Number(coin?.changePercent24Hr).toFixed(3)}
            </span>
          </a>
        </section>
    </div>
  )
}

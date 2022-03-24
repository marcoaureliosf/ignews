import { GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import { stripe } from '../services/stripe'

import { SubscribeButton } from '../components/SubscribeButton'

import styles from './home.module.scss'

interface HomeProps {
  product: {
    priceId: string
    amount: number
  }
}

function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>Hey, welcome</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>
            Get acess to all the publications <br />
            <span>for {product.amount} mounth</span>
          </p>
          <SubscribeButton priceId={product.priceId}/>
        </section>

        <Image src="/images/avatar.svg" alt="Girl coding" width={336} height={521} />
      </main>
    </>
  )
}

export default Home

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1KghU0KnXvAjIB640JOi1b4J', {
    expand: ['product']
  })

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price.unit_amount! / 100)
  }
  
  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24 // 24 hours
  }
}  

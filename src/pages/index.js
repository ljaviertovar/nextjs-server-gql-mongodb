import { useEffect, useRef, useState } from 'react'
import { ApolloClient, InMemoryCache, createHttpLink, useLazyQuery, useQuery } from '@apollo/client'

import Head from 'next/head'
import { Button, Container, Grid, Input, Spacer, User, Row } from "@nextui-org/react"

import GET_USERS from '@/graphql/queries/getUsers.gql'
import SEARCH_USERS from '@/graphql/queries/searchUsers.gql'

import { request } from 'graphql-request'

import { gql } from 'apollo-server-core'

import client from '@/graphql/apollo-client'

export default function Home({ staticUsers = [] }) {

  const [users, setUsers] = useState(staticUsers)
  const [searchValue, setSearchValue] = useState('')

  const staticUSersRef = useRef(staticUsers)

  // const { data } = useQuery(GET_USERS)

  const [getSearchedUsers] = useLazyQuery(SEARCH_USERS, {
    fetchPolicy: 'network-only',
    onCompleted(data) {
      setUsers(data.searchUser)
    }
  })

  const searchUser = () => {
    getSearchedUsers({
      variables: {
        value: searchValue
      }
    })
  }

  // useEffect(() => {

  //   if (data) {
  //     setUsers(data.users)
  //   }
  // }, [data])


  return (
    <>
      <Head>
        <title>Nextjs and Graphql Setup</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main >

        <Container css={{ display: 'flex', justifyContent: 'center' }}>
          <Spacer y={2.5} />
          <Row justify="center" align="center">

            <Input
              clearable
              labelPlaceholder="User"
              onClearClick={() => setUsers(staticUSersRef.current)}
              initialValue={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Button color="gradient" auto onClick={() => searchUser()}>
              Search user
            </Button>
          </Row>

          <Spacer y={2.5} />
          <Row justify="center" align="center">

            <Grid.Container gap={2} justify="center">
              {users.map(u => (
                <Grid xs={3}
                  key={u.id}
                >
                  <User
                    src={u.image}
                    name={`${u.firstName}${u.lastName}`}
                    description={u.email}
                    size="lg"
                    bordered
                    color="gradient"
                  />
                </Grid>

              ))
              }
            </Grid.Container>
          </Row>
        </Container>
      </main>
    </>
  )
}

export const getServerSideProps = async () => {

  // let results = await fetch('http://localhost:3000/api/graphql', {
  //   method: 'POST',

  //   headers: {
  //     "Content-Type": "application/json"
  //   },

  //   body: JSON.stringify({
  //     query: `{
  //       users {
  //         		id
  //         		firstName
  //         		lastName
  //         		email
  //         		username
  //         		image
  //         	}
  //     }`
  //   })
  // })
  // let { data } = await results.json()

  // console.log('DATA', data)
  // let results = await fetch('https://rickandmortyapi.com/graphql', {
  //   method: 'POST',

  //   headers: {
  //     "Content-Type": "application/json"
  //   },

  //   body: JSON.stringify({
  //     query: `{
  //       characters {
  //         results {
  //           name
  //         }
  //       }
  //     }`
  //   })
  // })
  // let characters = await results.json()
  // console.log(characters.data)

  // return {
  //   props: {
  //     characters: characters.data
  //     // staticUsers: data.users
  //     // staticUsers: []
  //   }
  // }

  //   const query = `
  //   query {
  //     users {
  //       id
  //       firstName
  //       lastName
  //       email
  //       image
  //     }
  //   }
  // `
  //   const data = await request('http://localhost:3000/api/graphql', query)

  const client = new ApolloClient({
    ssrMode: true,
    link: createHttpLink({
      uri: 'http://localhost/api/graphql',
      credentials: 'same-origin',
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT'
      },
    }),
    cache: new InMemoryCache(),
  })



  const { data } = await client.query({ query: GET_USERS })

  return { props: { staticUsers: data.users } }
}

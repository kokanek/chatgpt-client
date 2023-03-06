import { Flex, Stack, Text, Image, Input, IconButton, Box, Button } from '@chakra-ui/react';
import { IoSend, IoSettings } from 'react-icons/io5'
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import ReactMarkdown from 'react-markdown'
import BeatLoader from "react-spinners/BeatLoader";
import { useEffect, useState } from 'react';

export default function Home() {

  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const onTextType = (e) => {
    setText(e.target.value);
  }

  const onSendClick = async () => {
    if (text === '') return;
    setText('');
    setLoading(true);
    fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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'
      },
      body: JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": [{ "role": "user", "content": text }]
      })
    }).then(async (res) => {
      if (res.status === 200) {
        const json = await res.json();
        const reply = json.choices[0].message;
        setMessages([reply, { role: 'user', content: text }, ...messages]);
      } else {
        console.log(res);
      }
    }).catch((e) => {
      console.log(e);
    }).finally(() => {
      setLoading(false);
    });
  }

  console.log('loading: ', loading);
  return (
    <Flex w="100%" h="100vh" justify="center" align="center" className='backgroundPattern'>
      <Flex w={["100%", "60%", "50%"]} h="100%" flexDir="column" bgColor="white">
        <Stack py={2} pl={2} direction={'row'} spacing={4} align={'center'} bgColor="gray.500">
          <Image
            src={"/chat-gpt-icon.png"}
            boxSize='48px'
            alt="Chat GPT icon"
          />
          <Stack direction={'column'} spacing={0} fontSize={'sm'}>
            <Text fontSize={16} color={'white'} fontWeight={600}>Chat GPT</Text>
            <Text color={'white'}>Ask me anything!</Text>
          </Stack>
        </Stack>
        <Flex h="100%" py={4} bgColor="gray.100" direction={'column-reverse'} overflowY="auto">
          {loading && (
            <Box
              alignSelf={'flex-start'}
              marginLeft={2}
              p={2}
              rounded={'xl'}>
              <Button
                isLoading={loading}
                colorScheme='blue'
                spinner={<BeatLoader size={8} color='white' />}
              />
            </Box>)
          }
          {
            messages.map((m) => (
              m.role === 'assistant' ? <ResponseMessage key={m.content}>{m.content}</ResponseMessage> : <SentMessage key={m.content}>{m.content}</SentMessage>
            ))
          }
        </Flex>
        <Stack py={2} px={2} direction={'row'} align={'center'} spacing={2} >
          <Input
            size='lg'
            pr='4rem'
            type={'text'}
            placeholder='Chat here...'
            onChange={onTextType}
            value={text}
            onKeyUp={(e) => {
              if (e.code === 'Enter') {
                onSendClick();
              }
            }}
          />
          <IconButton
            colorScheme='blue'
            aria-label='Call Segun'
            size='lg'
            icon={<IoSettings />}
            isLoading
            spinner={<BeatLoader size={8} color='white' />}
          />
          <IconButton
            colorScheme='teal'
            aria-label='Call Segun'
            size='lg'
            icon={<IoSend onClick={onSendClick} />}
          />
        </Stack>
      </Flex>
    </Flex>
  )
}

const SentMessage = ({ children }) => {
  return (
    <Box
      alignSelf={'flex-end'}
      bg={'white'}
      boxShadow={'lg'}
      mx={2}
      my={2}
      p={2}
      width={'80%'}
      rounded={'xl'}>
      <ReactMarkdown
        components={ChakraUIRenderer()}
        // eslint-disable-next-line react/no-children-prop
        children={children}
        skipHtml />
    </Box>
  );
};

const ResponseMessage = ({ children }) => {
  return (
    <Box
      alignSelf={'flex-start'}
      bg={'green.100'}
      boxShadow={'lg'}
      mx={2}
      my={2}
      p={2}
      width={'80%'}
      rounded={'xl'}>
      {/* <pre>{children}</pre> */}
      <ReactMarkdown
        components={ChakraUIRenderer()}
        // eslint-disable-next-line react/no-children-prop
        children={children}
        skipHtml />
    </Box>
  );
};
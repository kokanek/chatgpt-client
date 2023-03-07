import { Flex, Stack, Text, Image, Input, IconButton, Box, Button, InputGroup, InputRightElement } from '@chakra-ui/react';
import { IoSend, IoSettings } from 'react-icons/io5'
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import ReactMarkdown from 'react-markdown'
import BeatLoader from "react-spinners/BeatLoader";
import { useEffect, useState } from 'react';

export default function Home() {

  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [openAIKey, setOpenAIKey] = useState('');

  const onTextType = (e) => {
    setText(e.target.value);
  }

  // read variable from local storage and set it to the state
  useEffect(() => {
    const keyFromLocalStorage = localStorage.getItem('apiKey');
    if (keyFromLocalStorage) {
      setOpenAIKey(keyFromLocalStorage);
    }
  }, [])

  // useEffect(() => {
  //   async function sendSetupMessage() {
  //     const promptArray = [
  //       { "role": "system", "content": 'You will reply like a drunk human being who has had 5 drinks' }
  //     ]
  //     setLoading(true);
  //     await fetch('https://api.openai.com/v1/chat/completions', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${openAIKey}`
  //       },
  //       body: JSON.stringify({
  //         "model": "gpt-3.5-turbo",
  //         "messages": promptArray
  //       })
  //     })
  //     setLoading(false);
  //     setMessages(promptArray);
  //   }

  //   sendSetupMessage();
  // }, []);

  // const toast = useToast()

  const onSendClick = async () => {
    console.log('reached here: ', text);
    if (text === '') return;
    setText('');
    setMessages([...messages, { role: 'user', content: text }]);
    setLoading(true);

    fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAIKey}`
      },
      body: JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": [...messages, { "role": "user", "content": text }]
      })
    }).then(async (res) => {
      if (res.status === 200) {
        const json = await res.json();
        const reply = json.choices[0].message;
        setMessages((currentMessages) => [...currentMessages, reply]);
      } else {
        console.log(res);
      }
    }).catch((e) => {
      // toast({
      //   title: 'API Error',
      //   description: "Error while calling the OpenAI API. Please check your API key and try again.",
      //   status: 'success',
      //   duration: 1000,
      //   isClosable: true,
      // });
      console.log(e);
    }).finally(() => {
      setLoading(false);
    });
  }

  return (
    <Flex w="100%" h="100vh" justify="center" align="center" className='backgroundPattern'>
      <Flex w={["100%", "60%", "50%"]} h="100%" flexDir="column" bgColor="white">
        <Stack direction={'row'} px={2} align={'center'} justify={'space-between'} bgColor="gray.500">
          <Stack py={2} direction={'row'} spacing={4} align={'center'} >
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
          <IconButton
            justifySelf={'flex-end'}
            colorScheme='gray.500'
            size='lg'
            icon={<IoSettings onClick={() => setShowSettings(!showSettings)} />}
          />
        </Stack>
        {(showSettings || openAIKey.trim() === '') && <Stack direction={'row'} p={2} align={'center'} justify={'space-between'}>
          <InputGroup size='md'>
            <Input
              pr='4rem'
              type={'text'}
              placeholder='Your open AI key'
              onChange={(e) => setApiKey(e.target.value)}
            />
            <InputRightElement width='4.5rem'>
              <Button h='1.75rem' mr={2} size='sm' onClick={() => {
                setOpenAIKey(apiKey)
                localStorage.setItem('apiKey', apiKey);
                setShowSettings(false);
              }}>
                {'Set key'}
              </Button>
            </InputRightElement>
          </InputGroup>
        </Stack>}
        <Flex h="84%" direction={'column'} justify={'flex-end'}>
          <Flex minH="100%" direction={'column'} overflow='auto' py={4} bgColor="gray.100"  >
            {
              messages.map((m) => (
                m.role === 'assistant' ? <ResponseMessage key={m.content}>{m.content}</ResponseMessage> : <SentMessage key={m.content}>{m.content}</SentMessage>
              ))
            }
            {loading && (
              <Box
                alignSelf={'flex-start'}
                p={2}
                rounded={'xl'}>
                <Button
                  isLoading={loading}
                  colorScheme='green'
                  spinner={<BeatLoader size={8} color='white' />}
                />
              </Box>)
            }
          </Flex>
        </Flex>
        <Stack py={2} px={2} direction={'row'} align={'center'} spacing={2} >
          <Input
            size='lg'
            pr='4rem'
            type={'text'}
            placeholder={openAIKey ? 'Chat here...' : 'Please set your open AI key in the top box'}
            onChange={onTextType}
            value={text}
            onKeyUp={(e) => {
              if (e.code === 'Enter') {
                onSendClick();
              }
            }}
          />
          {openAIKey.trim() && <IconButton
            colorScheme='teal'
            aria-label='Call Segun'
            size='lg'
            icon={<IoSend onClick={() => onSendClick()} />}
          />}
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
      px={2}
      pt={2}
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
import { Flex, Stack, Text, Image, Input, IconButton, Box, Spinner } from '@chakra-ui/react';
import { IoSend, IoSettings } from 'react-icons/io5'
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

    try {
      setText('');
      setLoading(true);
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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'
        },
        body: JSON.stringify({
          "model": "gpt-3.5-turbo",
          "messages": [{ "role": "user", "content": text }]
        })
      });
      setLoading(false);

      if (res.status === 200) {
        const json = await res.json();
        const reply = json.choices[0].message;
        setMessages([reply, { role: 'user', content: text }, ...messages]);
      } else {
        console.log(res);
      }
    } catch (e) {
      console.log(e);
    }
  }

  console.log('messages: ', messages);
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
        <Stack h="100%" py={4} spacing={2} bgColor="gray.100" direction={'column-reverse'} overflowY="auto">
          {loading ? <Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.500'
            size='xl'
          /> :
            messages.map((m) => (
              m.role === 'assistant' ? <ResponseMessage key={m.content} bgColor={'red'}>{m.content}</ResponseMessage> : <SentMessage key={m.content} bgColor={'blue'}>{m.content}</SentMessage>
            ))
          }
        </Stack>
        <Stack py={2} px={2} direction={'row'} align={'center'} spacing={2} >
          <Input
            size='lg'
            pr='4rem'
            type={'text'}
            placeholder='Chat here...'
            onChange={onTextType}
            value={text}
          />
          <IconButton
            colorScheme='blue'
            aria-label='Call Segun'
            size='lg'
            icon={<IoSettings />}
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
      p={2}
      width={'80%'}
      rounded={'xl'}>
      <Text>{children}</Text>
    </Box>
  );
};

const ResponseMessage = ({ children }) => {
  return (
    <Box
      alignSelf={'flex-start'}
      bg={'green.100'}
      boxShadow={'lg'}
      marginLeft={2}
      p={2}
      width={'80%'}
      rounded={'xl'}>
      <Text>{children}</Text>
    </Box>
  );
};

console.log(SentMessage);
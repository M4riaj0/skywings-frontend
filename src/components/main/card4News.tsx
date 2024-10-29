import {Card, CardContent, CardMedia, Typography, CardActionArea } from '@mui/material';

export interface NewsItem {
  title: string;
  content: string;
}

export function Card4News(newItem: NewsItem) {
  return (
    <Card sx={{ maxWidth: 300, height: 330 }}>
      <CardActionArea className='h-full flex flex-col justify-start'>
        <CardMedia
          component="img"
          image="https://img.freepik.com/free-photo/woman-with-hat-sitting-chairs-beach-beautiful-tropical-beach-woman-relaxing-tropical-beach-koh-nangyuan-island_335224-1110.jpg?t=st=1730174451~exp=1730178051~hmac=8616d7e860d719ac28000d6a0c12243d75bbaca89bb6e31e7b8f6c14f9e8ab3b&w=740"
          alt="woman relaxing on a tropical beach"
          className='h-40'
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
        {newItem.title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {newItem.content}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

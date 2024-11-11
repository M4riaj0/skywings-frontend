import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
} from "@mui/material";

export interface NewsItem {
  title: string;
  content: string;
  image: string;
}

export function Card4News(newItem: NewsItem) {
  if (newItem.content) {
    return (
      <Card sx={{ maxWidth: 270, height: 340 }}>
        <CardActionArea className="h-full flex flex-col justify-start">
          <CardMedia
            component="img"
            image={newItem.image}
            alt="Imagen de viajes"
            className="h-40"
          />
          <CardContent>
            <Typography
              gutterBottom
              component="div"
              className="font-bold text-lg"
            >
              {newItem.title}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {newItem.content.split("\n").map((line, index) =>
                !line.includes("primera") ? (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                ) : null
              )}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }
}

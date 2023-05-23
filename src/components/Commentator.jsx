import { DeleteOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme, Divider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setPost } from "../state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";

const Commentator = ({
  postId,
  commentId,
  name,
  commentBody,
  userPicturePath,
  setIsComments,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);

  const token = useSelector((state) => state.token);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const [actualUserId] = commentId.split("_");

  const isMyComment = _id === actualUserId ? true : false;

  const deleteComment = async () => {
    const response = await fetch(
      `http://localhost:3001/posts/${postId}/${commentId}/comment`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId: commentId }),
      }
    );
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
    setIsComments(true);
  };

  return (
    <>
      <FlexBetween m="0.25rem auto">
        <FlexBetween gap="0.75rem">
          <UserImage image={userPicturePath} size="35px" />
          <Box
            onClick={() => {
              navigate(`/profile/${actualUserId}`);
              navigate(0);
            }}
          >
            <Typography
              color={main}
              variant="h6"
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {name}
            </Typography>
            <Typography color={medium} fontSize="1rem">
              {commentBody}
            </Typography>
          </Box>
        </FlexBetween>
        {isMyComment && (
          <IconButton
            onClick={() => deleteComment()}
            sx={{ backgroundColor: primaryLight, p: "0.3rem" }}
          >
            <DeleteOutlined sx={{ color: primaryDark }} />
          </IconButton>
        )}
      </FlexBetween>
      <Divider />
    </>
  );
};

export default Commentator;

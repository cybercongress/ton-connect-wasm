import Display from "@/components/common/containerGradient/Display/Display";
import DisplayTitle from "@/components/common/containerGradient/DisplayTitle/DisplayTitle";
import { useQueryClientPussy } from "@/queryClientPussy";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import styles from "./Posts.module.scss";

function Posts({ publicKey }) {
  const client = useQueryClientPussy();

  const { data, isLoading, error } = useQuery({
    queryKey: ["posts", publicKey],
    refetchInterval: 10 * 1000,
    queryFn: async () => {
      return client!.queryContractSmart(
        "pussy15s8v0pa5g60uhvmjpfj73p6nem6t597e8qnkgpsuck5tje3se7ps3ll7kl",
        {
          get_posts: {
            pubkey: publicKey,
          },
        }
      );
    },
  });

  console.log(error);

  return (
    <Display title={<DisplayTitle title="Your posts" />}>
      {isLoading && <div>Loading...</div>}

      {!data && !isLoading && <div>No data</div>}

      <div className={styles.wrapper}>
        {data?.map((post: any) => (
          <div key={post.timestamp}>
            <div>
              {Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "long",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              }).format(post.timestamp * 1000)}
            </div>

            <p>{post.post}</p>
          </div>
        ))}
      </div>
    </Display>
  );
}

export default Posts;
